import React, { Component } from 'react';
import {
	View,
	Animated,
	Dimensions,
	FlatList,
	PanResponder,
	StyleSheet
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class SideSwipe extends Component {

  	static defaultProps = {
		contentOffset: 0,
		data: [],
		extractKey: (item, index) => `sideswipe-carousel-item-${index}`,
		itemWidth: screenWidth,
		onEndReached: () => {},
		onEndReachedThreshold: 0.9,
		onIndexChange: () => {},
		renderItem: () => null,
		shouldCapture: ({ dx }) => Math.abs(dx) > 1,
		shouldRelease: () => false,
		threshold: 0,
		useVelocityForIndex: true,
		useNativeDriver: true
	};

  	constructor(props) {
		super(props);

		const currentIndex =  props.index ? props.index : 0;
		const initialOffset = currentIndex * props.itemWidth;
		const scrollPosAnim = new Animated.Value(initialOffset);
		const itemWidthAnim = new Animated.Value(props.itemWidth);
		const animatedValue = Animated.divide(scrollPosAnim, itemWidthAnim);

		this.state = {
			animatedValue,
			currentIndex,
			itemWidthAnim,
			scrollPosAnim
		};
	}

	componentWillMount = () => {
		this.panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: this.handleGestureCapture,
			onPanResponderMove: this.handleGestureMove,
			onPanResponderRelease: this.handleGestureRelease,
			onPanResponderTerminationRequest: this.handleGestureTerminationRequest
		});
	};

	componentDidUpdate = (prevProps) => {
		const { contentOffset, index, itemWidth } = this.props;

		if (prevProps.itemWidth !== itemWidth) {
			this.state.itemWidthAnim.setValue(itemWidth);
		}

		if (Number.isInteger(index) && index !== prevProps.index) {
			this.setState(
				() => ({ currentIndex: index }),
				() => {
					setTimeout(() =>
						this.list.scrollToIndex({
						animated: true,
						index: this.state.currentIndex,
						viewOffset: contentOffset,
					}));
				}
			);
		}
	};

	render = () => {
		const {
			contentContainerStyle,
			contentOffset,
			data,
			extractKey,
			flatListStyle,
			renderItem,
			style,
			itemWidth
		} = this.props;
		const { animatedValue, currentIndex, scrollPosAnim } = this.state;
		const dataLength = data.length;

		return (
			<View
				style={[{ width: itemWidth - 2 }, style]}
				{...this.panResponder.panHandlers}>
				<AnimatedFlatList
					horizontal
					contentContainerStyle={[
						{ paddingHorizontal: contentOffset },
						contentContainerStyle,
					]}
					data={data}
					getItemLayout={this.getItemLayout}
					keyExtractor={extractKey}
					initialScrollIndex={currentIndex}
					ref={this.getRef}
					scrollEnabled={false}
					showsHorizontalScrollIndicator={false}
					style={[styles.flatList, flatListStyle]}
					onEndReached={this.props.onEndReached}
					onEndReachedThreshold={this.props.onEndReachedThreshold}
					scrollEventThrottle={1}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { x: scrollPosAnim } } }],
						{ useNativeDriver: this.props.useNativeDriver },
					)}
					renderItem={({ item, index }) =>
						renderItem({
						item,
						currentIndex,
						itemIndex: index,
						itemCount: dataLength,
						animatedValue: animatedValue,
						})
					} />
			</View>
		);
	};

	getRef = (ref) => {
		if (ref) {
			this.list = ref._component ? ref._component : ref;
		}
	};

	getItemLayout = (data, index) => ({
		offset: this.props.itemWidth * index + this.props.contentOffset,
		length: this.props.itemWidth,
		index
	});

	handleGestureTerminationRequest = (e, s) =>
		this.props.shouldRelease(s);

	handleGestureCapture = (e, s) =>
		this.props.shouldCapture(s);

	handleGestureMove = (e, { dx }) => {
		const currentOffset =
		this.state.currentIndex * this.props.itemWidth;
		const resolvedOffset = currentOffset - dx;

		this.list.scrollToOffset({
			offset: resolvedOffset,
			animated: false
		});
	};

	handleGestureRelease = (e, { dx, vx }) => {
		const currentOffset =
		this.state.currentIndex * this.props.itemWidth;
		const resolvedOffset = currentOffset - dx;
		const resolvedIndex = Math.round(
			(resolvedOffset +
				(dx > 0 ? -this.props.threshold : this.props.threshold)) /
				this.props.itemWidth
		);

		let newIndex;

		if (this.props.useVelocityForIndex) {
			const absoluteVelocity = Math.round(Math.abs(vx));
			const velocityDifference = absoluteVelocity < 1 ? 0 : absoluteVelocity - 1;

			newIndex =
				dx > 0
				? Math.max(resolvedIndex - velocityDifference, 0)
				: Math.min(
					resolvedIndex + velocityDifference,
					this.props.data.length - 1,
					);
		} else {
			newIndex =
				dx > 0
				? Math.max(resolvedIndex, 0)
				: Math.min(resolvedIndex, this.props.data.length - 1);
		}

		this.list.scrollToIndex({
			index: newIndex,
			animated: true,
			viewOffset: this.props.contentOffset,
		});

		this.setState(
			() => ({ currentIndex: newIndex }),
			() => this.props.onIndexChange(newIndex)
		);
	};
}

const styles = StyleSheet.create({
	flatList: {
		flexGrow: 1
	}
});

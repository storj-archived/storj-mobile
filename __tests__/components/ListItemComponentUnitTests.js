import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import ListItemComponent from '../../src/components/Lists/ListItemComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('ListItemComponent', ()=> {

	it('renders correctly', () => {
		const wrapper = shallow(
			<ListItemComponent 
                item = {{ getName: () => {}, getStarred: () => {}, entity: { thumbnail: {} } }} />	
		);

		expect(wrapper).toMatchSnapshot();
	});
});


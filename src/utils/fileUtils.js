export function getFullFileName(fullName) {
    let dotIndex = fullName.lastIndexOf('.');
    let name = dotIndex !== -1 ? fullName.slice(0, dotIndex) : fullName;
    let extention = dotIndex !== -1 ? fullName.slice(dotIndex) : '';

    return { name, extention }
}

export function getFileSize(itemSize) {
    if(!itemSize) return '0 bytes';

    if(itemSize < 1024) return itemSize.toString() + ' bytes';
    
    if(itemSize < 1048576) {
        let kbSize = (itemSize / 1024).toString().slice(0, 5).split(' ');

        if(kbSize[kbSize.length - 1] === 0) {
            kbSize.splice(kbSize.length - 1, 1, 1);
        }
        return kbSize + ' KB'
    } 
    
    if(itemSize < 1073741824) {
        let mbSize = (itemSize / 1048576).toString().slice(0, 5).split(' ');

        if(mbSize[mbSize.length - 1] === 0) {
            mbSize.splice(mbSize.length - 1, 1, 1);
        }
        return mbSize + ' MB'
    } 
    
    let gbSize = (itemSize / 1048576*1024).toString().slice(0, 5).split(' ');

    if(gbSize[gbSize.length - 1] === 0) {
        gbSize.splice(gbSize.length - 1, 1, 1);
    }

    return gbSize + ' GB'     
}

export function getShortBucketName(name) {
    if(name.length > 13) {
        let firstRowName = name.slice(0,10) + '...';

        return firstRowName;
    }; 

    return name;
}

export function getShortFileName(fullName) {
    let { name, extention } = getFullFileName(fullName);

    if(fullName.length > 13){

        if(name.length > 7) {
            name = name.slice(0,5) + '..';
        }

        if(extention.length > 6) {
            extention = '.' +  extention.slice(extention.length - 5, extention.length - 1);
        }
    }

    return { name, extention };
}

export function isImage(imageFullName) {
    if (!imageFullName) {
        return false;
    }

    let extension = imageFullName.split('.').pop();

    return ['tif', 'tiff', 'gif', 'jpeg', 'jpg', 'jif', 'jfif', 'jp2', 'jpx', 'j2k', 'j2c', 'fpx', 'pcd', 'png']
        .includes(extension);
}
/* export function renderItemName() {
    switch(this.props.itemType) {
        case TYPES.REGULAR_BUCKET: {
            const name = this.props.item.getName();

            if(name.length > 13) {
                let firstRowName = name.slice(0,10) + '...';

                return(
                    <View style = { gridItemStyles.textMargin }>
                        <Text style = { gridItemStyles.mainTitleText }>{ firstRowName }</Text> 
                    </View>
                )
            }; 

            return(
                <Text numberOfLines = {1} style = { [gridItemStyles.mainTitleText, gridItemStyles.textMargin] }>{ name }</Text> 
            ); 
        } 
            
        break;
        case TYPES.REGULAR_FILE: {
            const fullName = this.props.item.getName();
            const dotIndex = fullName.lastIndexOf('.');
            const name = fullName.slice(0, dotIndex);
            const extention = fullName.slice(dotIndex);

            if(fullName.length > 13){

                if(name.length > 7) {
                    name = name.slice(0,5) + '..';
                }

                if(extention.length > 6) {
                    extention = '.' +  extention.slice(extention.length - 5, extention.length - 1);
                }

                return(
                    <View style = { gridItemStyles.textMargin }>
                        <Text style = { gridItemStyles.mainTitleText }>{ name }
                            <Text style = { gridItemStyles.extentionText }>{ extention }</Text>
                        </Text> 
                    </View>
                )
            }

            return(
                <Text numberOfLines = {1} style = { [gridItemStyles.mainTitleText, gridItemStyles.textMargin] }>{ name }
                    <Text style = { gridItemStyles.extentionText }>{ extention }</Text>
                </Text> 
        )};
        break;
        default: return(
            <Text numberOfLines = {1} style = { [gridItemStyles.mainTitleText, gridItemStyles.textMargin] }>{ this.props.item.getName() }</Text> 
        ); 
    }
} */
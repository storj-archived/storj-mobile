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
        return name.slice(0,10) + '...';
    }; 

    return name;
}

export function getFileNameWithFixedSize(fullName, size) {
    let { name, extention } = getFullFileName(fullName);

    if(fullName.length > size + 5){

        if(name.length > size) {
            name = name.slice(0, size - 2) + '..';
        }

        if(extention.length > 6) {
            extention = '.' +  extention.slice(extention.length - 5, extention.length - 1);
        }
    }

    return { name, extention };
}

export function getShortFileName(fullName) {
    
    return getFileNameWithFixedSize(fullName, 7);
}

export function isImage(imageFullName) {
    if (!imageFullName) {
        return false;
    }

    let extension = imageFullName.split('.').pop().toLowerCase();

    return ['tif', 'tiff', 'gif', 'jpeg', 'jpg', 'jif', 'jfif', 'jp2', 'jpx', 'j2k', 'j2c', 'fpx', 'pcd', 'png', 'heic']
        .includes(extension);
}

export function getFileCopyName(fileName) {
    let name = getFullFileName(fileName);

    let regx = /\(\d*\)$/gi;

    let res = regx.exec(name.name);

    let pureName = name.name.replace(regx, "");
    let newName = pureName;

    if(res) {
        let strippedIndex = res[0].replace(/(\()/gi, "").replace(/(\))/gi, "");
        let newIndex = "(" + (Number(strippedIndex) + 1) + ")";

        newName = pureName + newIndex;
    } else {
        newName = pureName + "(1)";
    }

    return newName + name.extention;
}
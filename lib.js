const minimatch = require('minimatch')

const getDeleteObjects = (oldObjects, newObjectsKeys, deletePattern) => {
  return oldObjects.filter(oldObject => {
    const isNewObject = newObjectsKeys.some(newObjectKey => newObjectKey === oldObject.Key)

    if (deletePattern) {
      return !isNewObject && minimatch(oldObject.Key, deletePattern, { matchBase: true })
    }

    return !isNewObject
  })
}

const getTagObjects = (oldObjects, newObjectsKeys, deleteObjects) => {
  return oldObjects.filter(oldObject => {
    return !newObjectsKeys.some(newObjectKey => newObjectKey === oldObject.Key)
      && !deleteObjects.some(deleteObject => deleteObject.Key === oldObject.Key)
  })
}

module.exports = {
  getDeleteObjects,
  getTagObjects
}

const minimatch = require('minimatch')

const getDeleteObjects = (oldObjects, newObjectsKeys, deletePattern) => {
  if (!deletePattern) {
    return []
  }

  return oldObjects.filter(oldObject => {
    const isNewObject = newObjectsKeys.some(newObjectKey => newObjectKey === oldObject.Key)
    return !isNewObject && minimatch(oldObject.Key, deletePattern, { matchBase: true })
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

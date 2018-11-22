const AWS = require('aws-sdk')
const logger = require('consola').withScope('S3-safety-deploy')
const parseArgs = require('minimist')
const walkSync = require('walk-sync')
const fs = require('fs')
const { promisify } = require('util')
const mime = require('mime-types')
const { getDeleteObjects, getTagObjects } = require('./lib.js')
const trailingSlashIt = require('trailing-slash-it')

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    b: 'bucket',
    bd: 'bucketDir',
    ud: 'uploadDir',
    dp: 'deletePattern',
  },
  default: {
    bucketDir: null
  },
  string: ['b', 'bd', 'ud', 'dp']
})

module.exports = async () => {
  try {
    const S3 = new AWS.S3()
    const { bucket, bucketDir, uploadDir, deletePattern } = argv

    logger.info(`Bucket: ${bucket}`)
    logger.info(`Bucket Directory: ${bucketDir}`)
    logger.info(`Upload Directory: ${uploadDir}`)

    const { Contents } = await S3.listObjectsV2({
        Bucket: bucket,
        Prefix: bucketDir || null
      }).promise()
    const beforeUploadObjects = Contents

    /**
     * Upload
     */
    const uploadFiles = walkSync(uploadDir, { directories: false })
    const uploadS3Keys = []
    logger.info(`Uploading new ${uploadFiles.length} files`)

    for (uploadFile of uploadFiles) {
      const fileBuffer = await promisify(fs.readFile)(`${trailingSlashIt(uploadDir)}${uploadFile}`)
      const s3key = bucketDir
        ? `${trailingSlashIt(bucketDir)}${uploadFile}`
        : uploadFile

      uploadS3Keys.push(s3key)
      logger.info(s3key)

      await S3.putObject({
        Bucket: bucket,
        Key: s3key,
        Body: fileBuffer,
        ContentType: mime.lookup(uploadFile) || 'application/octet-stream'
      }).promise()
    }

    logger.success(`Uploaded new ${uploadFiles.length} files`)

    /**
     * Delete
     */
    logger.info(`deletePattern is ${deletePattern}`)
    const deleteObjects = getDeleteObjects(beforeUploadObjects, uploadS3Keys, deletePattern)

    if (deleteObjects.length === 0) {
      logger.info('No objects to delete')
    } else {
      logger.info(`Deleting ${deleteObjects.length} files`)

      await S3.deleteObjects({
        Bucket: bucket,
        Delete: {
          Objects: deleteObjects.map(object => {
            logger.info(object.Key)
            return { Key: object.Key }
          })
        }
      }).promise()

      logger.info(`Deleted ${deleteObjects.length} files`)
    }

    /**
     * Tag
     */
    const tagObjects = getTagObjects(beforeUploadObjects, uploadS3Keys, deleteObjects)

    if (tagObjects.length === 0) {
      logger.info('No objects to tag')
    } else {
      logger.info(`Tagging ${tagObjects.length} old files`)

      for (tagObject of tagObjects) {
        logger.info(tagObject.Key)

        await S3.putObjectTagging({
          Bucket: bucket,
          Key: tagObject.Key,
          Tagging: {
            TagSet: [
              {
                Key: 'ShouldDelete',
                Value: "1"
              }
            ]
          }
        }).promise()
      }

      logger.info(`Tagged ${tagObjects.length} old files`)
    }

    logger.success('Successfully deployment')
  } catch (e) {
    logger.error(e)
    process.exit(1)
  }
}

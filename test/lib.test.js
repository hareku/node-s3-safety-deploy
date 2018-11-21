const lib = require('../lib.js')

test('getDeleteObjects with null delete pattern', () => {
  const oldObjects = [
    { Key: 'file1.txt' },
    { Key: 'dir/file2.txt' },
  ]

  const newObjectKeys = [
    'file1.txt',
    'dir/file2.txt',
    'dir/file3.txt',
  ]

  expect(lib.getDeleteObjects(oldObjects, newObjectKeys, null)).toEqual([])
})

test('getDeleteObjects with *.html delete pattern', () => {
  const oldObjects = [
    { Key: 'file1.html' },
    { Key: 'dir/file2.html' },
    { Key: 'dir/file3.txt' },
    { Key: 'dir/file4.html' },
  ]

  const newObjectKeys = [
    'file1.txt',
    'dir/file1.html',
    'dir/file2.html',
  ]

  expect(lib.getDeleteObjects(oldObjects, newObjectKeys, '*.html')).toEqual([
    { Key: 'file1.html' },
    { Key: 'dir/file4.html' },
  ])
})

test('getDeleteObjects with * delete pattern', () => {
  const oldObjects = [
    { Key: 'file1.html' },
    { Key: 'file2.html' },
    { Key: 'dir/file3.html' },
    { Key: 'dir/file4.html' },
  ]

  const newObjectKeys = [
    'file2.html',
    'dir/file3.html',
  ]

  expect(lib.getDeleteObjects(oldObjects, newObjectKeys, '*')).toEqual([
    { Key: 'file1.html' },
    { Key: 'dir/file4.html' },
  ])
})

test('getTagObjects', () => {
  const oldObjects = [
    { Key: 'file1.txt' },
    { Key: 'dir/file2.txt' },
    { Key: 'dir/file3.txt' },
    { Key: 'dir/file4.html' },
  ]

  const newObjectKeys = [
    'dir/file3.txt',
  ]

  const deleteObjects = [
    { Key: 'dir/file2.txt' },
  ]

  expect(lib.getTagObjects(oldObjects, newObjectKeys, deleteObjects)).toEqual([
    { Key: 'file1.txt' },
    { Key: 'dir/file4.html' },
  ])
})

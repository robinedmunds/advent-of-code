import FileSystemRoot from "./FileSystemRoot"
import {
  File,
  Directory,
  FileSystemRoot as FSRType,
  FSObject
} from "./FileSystemRoot"

test("Successfully create dir at root", () => {
  const fs = new FileSystemRoot()

  fs.createDirectoryHere("aaa")
  expect(fs.currentDirectory.contents.has("aaa")).toBe(true)
})

test("Successfully create file at root", () => {
  const fs = new FileSystemRoot()

  fs.createFileHere("aaa", 22)
  expect(fs.currentDirectory.contents.has("aaa")).toBe(true)
})

test("Created file at root has correct size", () => {
  const fs = new FileSystemRoot()

  fs.createFileHere("aaa", 22)
  const file = fs.currentDirectory.contents.get("aaa")

  if (file && !(file instanceof Directory)) {
    expect(file.size).toBe(22)
  }
})

// depth 1

test("Successfully change to subordinate directory at 1 level of depth", () => {
  const fs = new FileSystemRoot()

  fs.createDirectoryHere("aaa")
  fs.changeDirectory("aaa")
  expect(fs.currentDirectory.name).toBe("aaa")
})

test("Successfully create dir at 1 level of depth", () => {
  const fs = new FileSystemRoot()

  fs.createDirectoryHere("aaa")
  fs.changeDirectory("aaa")
  fs.createDirectoryHere("bbb")
  expect(fs.currentDirectory.contents.has("bbb")).toBe(true)
})

test("Successfully create file at 1 level of depth", () => {
  const fs = new FileSystemRoot()

  fs.createDirectoryHere("aaa")
  fs.changeDirectory("aaa")
  fs.createFileHere("bbb", 11)
  expect(fs.currentDirectory.contents.has("bbb")).toBe(true)
})

test("Successfully move up 1 directory to root", () => {
  const fs = new FileSystemRoot()

  fs.createDirectoryHere("aaa")
  fs.changeDirectory("aaa")
  fs.changeDirectory("..")
  expect(fs.currentDirectory).toBe(fs)
})

// depth 2

test("Successfully change to subordinate directory at 2 levels of depth", () => {
  const fs = new FileSystemRoot()

  fs.createDirectoryHere("aaa")
  fs.changeDirectory("aaa")
  fs.createDirectoryHere("bbb")
  fs.changeDirectory("bbb")
  expect(fs.currentDirectory.name).toBe("bbb")
})

test("Successfully create dir at 2 levels of depth", () => {
  const fs = new FileSystemRoot()

  fs.createDirectoryHere("aaa")
  fs.changeDirectory("aaa")
  fs.createDirectoryHere("bbb")
  fs.changeDirectory("bbb")
  fs.createDirectoryHere("ccc")
  expect(fs.currentDirectory.contents.has("ccc")).toBe(true)
})

test("Successfully create file at 2 levels of depth", () => {
  const fs = new FileSystemRoot()

  fs.createDirectoryHere("aaa")
  fs.changeDirectory("aaa")
  fs.createDirectoryHere("bbb")
  fs.changeDirectory("bbb")
  fs.createFileHere("ccc", 22)

  expect(fs.currentDirectory.contents.has("ccc")).toBe(true)
})

test("Successfully move up 1 directory from 2 levels of depth", () => {
  const fs = new FileSystemRoot()

  fs.createDirectoryHere("aaa")
  fs.changeDirectory("aaa")

  fs.createDirectoryHere("bbb")
  fs.changeDirectory("bbb")
  fs.changeDirectory("..")
  expect(fs.currentDirectory.name).toBe("aaa")
})

// depth 3

test("Successfully change to subordinate directory at 3 levels of depth", () => {
  const fs = new FileSystemRoot()

  fs.createDirectoryHere("aaa")
  fs.changeDirectory("aaa")
  fs.createDirectoryHere("bbb")
  fs.changeDirectory("bbb")
  fs.createDirectoryHere("ccc")
  fs.changeDirectory("ccc")
  expect(fs.currentDirectory.name).toBe("ccc")
})

test("Successfully create dir at 3 levels of depth", () => {
  const fs = new FileSystemRoot()

  fs.createDirectoryHere("aaa")
  fs.changeDirectory("aaa")
  fs.createDirectoryHere("bbb")
  fs.changeDirectory("bbb")
  fs.createDirectoryHere("ccc")
  fs.changeDirectory("ccc")
  fs.createDirectoryHere("ddd")
  expect(fs.currentDirectory.contents.has("ddd")).toBe(true)
})

test("Successfully create file at 3 levels of depth", () => {
  const fs = new FileSystemRoot()

  fs.createDirectoryHere("aaa")
  fs.changeDirectory("aaa")
  fs.createDirectoryHere("bbb")
  fs.changeDirectory("bbb")
  fs.createDirectoryHere("ccc")
  fs.changeDirectory("ccc")
  fs.createFileHere("ddd", 22)

  expect(fs.currentDirectory.contents.has("ddd")).toBe(true)
})

test("Successfully move up 1 directory from 3 levels of depth", () => {
  const fs = new FileSystemRoot()

  fs.createDirectoryHere("aaa")
  fs.changeDirectory("aaa")
  fs.createDirectoryHere("bbb")
  fs.changeDirectory("bbb")

  fs.createDirectoryHere("ccc")
  fs.changeDirectory("ccc")
  fs.changeDirectory("..")
  expect(fs.currentDirectory.name).toBe("bbb")
})


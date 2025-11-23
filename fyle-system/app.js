const fs = require("fs/promises");

(async () => {
  //*Commands

  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const RENAME_FILE = "rename the file";
  const ADD_TO_FILE = "add to the file";

  // *Funtion to create file
  console.log("Starting file system watcher...");

  const createFile = async (path) => {
    let existingFile;
    try {
      existingFile = await fs.open(path, "r");
      if (existingFile)
        return console.log(`File at path ${path} already exists.`);
    } catch (error) {
      // we dont have the file, now we should create it
      if (error.code === "ENOENT") {
        const fileHandle = await fs.open(path, "w");
        await fileHandle.close();
        console.log(`File created at path: ${path}`);
      }
    } finally {
      if (existingFile) {
        await existingFile.close();
      }
    }
  };

  //* function to delete file

  const deleteFile = async (path) => {
    try {
      // we can also use rm but unlink is more specific for files
      await fs.unlink(path);
      console.log(`File with ${path} was deleted successfully`);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log(`File doesn't exist at path: ${path}`);
      } else {
        console.log("Error deleting file:", error);
        throw error; // Re-throw if it's not a "file not found" error
      }
    }
  };

  //*function to rename a path

  const renameFile = async (oldPath, newPath) => {
    let existingFile;
    try {
      existingFile = await fs.open(oldPath, "r");
      if (existingFile) await fs.rename(oldPath, newPath);
      console.log(`File with ${path} was renamed ${newPath}`);
    } catch (error) {
      if (error.code === "ENOENT") {
        return;
        console.log(`File doesn't exist at path: ${oldPath}`);
      }
    }
  };

  //*function to add to file
  const addToFile = async (path, content) => {
    let existingFile;
    try {
      existingFile = await fs.open(path, "a");
      if (existingFile) {
        const controller = new AbortController();
        const { signal } = controller;

        // Auto-abort after 5 seconds
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          await existingFile.write(content, { signal });
          clearTimeout(timeoutId); // Clear if write completes
        } catch (writeError) {
          clearTimeout(timeoutId);
          if (writeError.name === "AbortError") {
            console.log("Write operation timed out");
          }
          throw writeError;
        }
      }
      console.log(`content added to file with ${path}`);
    } catch (error) {
      console.log("error", error);
      if (error.code === "ENOENT") {
        console.log(`File doesn't exist at path: ${path}`);
      }
    } finally {
      await existingFile?.close();
    }
  };

  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async (err) => {
    //Get the size of the file
    const { size } = await commandFileHandler.stat();
    //allocate a buffer with the size of the file
    const buff = Buffer.alloc(size);
    //location at which we want to start filling the buffer
    const offset = 0;
    //number of bytes to read
    const length = buff.byteLength;
    //position from where to start reading the file
    const position = 0;
    //we always want to read the whole content
    await commandFileHandler.read(buff, offset, length, position);

    //decode 01 => meaningful content
    //encoder meaningful content => 01

    const command = buff.toString("utf-8");

    //create a file
    // create a file <path>

    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      console.log(`Creating file at path: ${filePath}`);
      await createFile(filePath);
    }

    //*Delete a file

    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      console.log(`Deleting file at path: ${filePath}`);
      await deleteFile(filePath);
    }

    //*Rename a file
    //? rename the file <path> to <new-path>

    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring(_idx + 4);
      console.log(`Renaming  file from path: ${oldFilePath} to ${newFilePath}`);
      await renameFile(oldFilePath, newFilePath);
    }

    //*Add to file
    //? add to the file <path> this content: <content>

    if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
      const content = command.substring(_idx + 15);
      console.log(`add content to  file with path: ${filePath} `);
      await addToFile(filePath, content);
    }
  });

  // watcher...
  const watcher = await fs.watch("./command.txt");

  for await (const event of watcher) {
    console.log(`Event type: ${event.eventType}`);
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();

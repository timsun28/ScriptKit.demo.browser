#!/usr/local/bin/node

// Node js example from https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging#app_side

(() => {
    let payloadSize = null;

    // A queue to store the chunks as we read them from stdin.
    // This queue can be flushed when `payloadSize` data has been read
    let chunks = [];

    // Only read the size once for each payload
    const sizeHasBeenRead = () => Boolean(payloadSize);

    // All the data has been read, reset everything for the next message
    const flushChunksQueue = () => {
        payloadSize = null;
        chunks.splice(0);
    };

    const processData = () => {
        // Create one big buffer with all the chunks
        const stringData = Buffer.concat(chunks);

        // The browser will emit the size as a header of the payload,
        // if it hasn't been read yet, do it.
        // The next time we'll need to read the payload size is when all of the data
        // of the current payload has been read (i.e. data.length >= payloadSize + 4)
        if (!sizeHasBeenRead()) {
            payloadSize = stringData.readUInt32LE(0);
        }

        // If the data we have read so far is >= to the size advertised in the header,
        // it means we have all of the data sent.
        // We add 4 here because that's the size of the bytes that hold the payloadSize
        if (stringData.length >= payloadSize + 4) {
            // Remove the header
            const contentWithoutSize = stringData.slice(4, payloadSize + 4);

            // Reset the read size and the queued chunks
            flushChunksQueue();

            const json = JSON.parse(contentWithoutSize);
            // Do something with the data…
        }
    };

    process.stdin.on("readable", () => {
        // A temporary variable holding the nodejs.Buffer of each
        // chunk of data read off stdin
        let chunk = null;

        // Read all of the available data
        while ((chunk = process.stdin.read()) !== null) {
            chunks.push(chunk);
        }

        processData();
    });

    // A function written by copilot to send data to the browser.
    // An example can be found for python on the link at the top of this file.
    function sendData() {
        const data = {
            message: "Hello from node.js",
        };
        const stringData = JSON.stringify(data);
        const sizeBuffer = Buffer.alloc(4);
        sizeBuffer.writeUInt32LE(stringData.length, 0);
        process.stdout.write(sizeBuffer);
        process.stdout.write(stringData);
    }
})();

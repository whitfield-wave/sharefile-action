const core = require("@actions/core");
const github = require("@actions/github");

const { getToken, getUploadLink, uploadFile } = require("./sharefile");
const fs = require("fs");

async function uploadToShareFile() {
	try {
		const clientID = core.getInput("client-id");
		const clientSecret = core.getInput("client-secret");
		const username = core.getInput("username");
		const password = core.getInput("password");
		const filePath = core.getInput("path-to-file");
		const fileName = core.getInput("file-name");
		const folder = core.getInput("folder-to-upload");
		const tag = core.getInput("tag");

		const file = await fs.openAsBlob(filePath);

		const token = await getToken(clientID, clientSecret, username, password);

		const uploadName = tag ? `${fileName}_${tag}` : fileName;
		const link = await getUploadLink(uploadName, folder, token);
		await uploadFile(file, fileName, link);
	} catch (error) {
		console.log(error);
		core.setFailed(error.message);
	}
}

uploadToShareFile();

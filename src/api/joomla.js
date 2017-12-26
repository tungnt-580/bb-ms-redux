import $ from 'jquery'
/**
 * get all files and directories in images/...
 * @param path
 * @return {$.ajax}: Use .done(res => {}) to handle this ajax request
 */
export const getAllFiles = (path = '/', endPoint, type) =>
	$.ajax({
		url: `${endPoint}${path === '/' ? '' : '&dir=' + path}&type=${type}`
	})

/**
 * handleUploadFile
 * @param {event|*} e event when file is selected via: onChange={this.handleUpload.bind(this)}
 * @param {string} path directory you want to upload to, default: '(images)/'
 * @param {array} allowType: array of allowed file type name, ex: image
 * @return {Promise}: use .then(res => {}) to handle this.
 */
export const handleUploadFile = (
	path = '/',
	endPoint,
	file,
	fileName,
	onProcess,
	allowType = []
) => {
	const reader = new FileReader()
	reader.readAsDataURL(file)
	return new Promise((resolve, reject) => {
		reader.onload = upload => {
			if (!file.type || !upload.target.result) {
				return reject('No file selected')
			}
			if (
				(file.type &&
					$.inArray(allowType, file.type.split('/')[0]) !== -1) ||
				allowType === []
			) {
				return reject('File type not allowed!')
			}
			const data = {
				dir: path,
				data_uri: upload.target.result,
				filename: fileName,
				filetype: file.type
			}
			uploadFile(endPoint, data, resolve, reject, onProcess)
		}
	}).catch(err => {
		console.log('there is an error', err)
	})
}

export const uploadFile = (endPoint, data, resolve, reject, onProcess) => {
	$.ajax({
		url: `${endPoint}`,
		type: 'POST',
		data: data,
		dataType: 'json',
		error: res => {
			reject(res)
		},
		success: res => {
			resolve(res)
		},
		xhr: () => {
			var xhr = new window.XMLHttpRequest()
			xhr.upload.addEventListener("progress", function (evt) {
					if (evt.lengthComputable) {
							var percentComplete = evt.loaded / evt.total
							onProcess(parseInt(percentComplete * 100) + '%')
					}
			}, false)
			return xhr
		}
	})
}

/**
 * create a folder in (images)/...
 * @param {string} path: where the new folder will be put
 * @param {string} name: name of the new folder
 * @return {$.ajax} : Use .done(res => {}) to handle this ajax request
 */
export const createFolder = (endPoint, path = '/', name) =>
	$.ajax({
		url: `${endPoint}${path === '/' ? '' : '&dir=' + path}&name=${name}`
	})

/**
 * delete a folder in (images)/...
 * @param {string} path: directory folder to be deleted
 * @return {$.ajax} : Use .done(res => {}) to handle this ajax request
 */
export const deleteFolder = (endPoint, path) =>
	$.ajax({
		url: `${endPoint}&dir=${path}`
	})

/**
 * rename a folder in (images)/...
 * @param {string} path: directory name of the folder
 * @param {string} newPath: new path of the new folder
 * @return {$.ajax} : Use .done(res => {}) to handle this ajax request
 */
export const renameFolder = (endPoint, path, newPath) =>
	$.ajax({
		url: `${endPoint}&dir=${path}&newPath=${newPath}`
	})

/**
 * delete a file in (images)/...
 * @param {string} filePath: path of file to be deleted
 * @return {$.ajax} : Use .done(res => {}) to handle this ajax request
 */
export const deleteFile = (endPoint, filePath) =>
	$.ajax({
		url: `${endPoint}&dir=${filePath}`
	})

/**
 * rename a file in (images)/...
 * @param {string} path: directory name of the folder
 * @param {string} newPath: new path of the new folder
 * @return {$.ajax} : Use .done(res => {}) to handle this ajax request
 */
export const renameFile = (endPoint, path, newPath) =>
	$.ajax({
		url: `${endPoint}&dir=${path}&newPath=${newPath}`
	})

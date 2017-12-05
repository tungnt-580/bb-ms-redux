import css from '../styles/index.css'
import { each, find, filter, reduce } from 'underscore'

export function mapViewType(viewType) {
	switch (viewType) {
		case 'list':
			return css['list']
		case 'grid':
			return css['grid']
		default:
			return css['grid']
	}
}

export function isMedia(name) {
	return name
		.toLowerCase()
		.match(
			/.(bmp|csv|doc|gif|ico|jpg|jpeg|odg|odp|ods|odt|pdf|png|ppt|swf|txt|xcf|xls)$/
		)
}

export function setPathToLocal(path) {
	if (typeof Storage !== 'undefined') {
		localStorage.setItem('mediaselectorpath', path)
	}
}

export function getPathFromLocal() {
	if (typeof Storage !== 'undefined') {
		return localStorage.getItem('mediaselectorpath') || '/'
	} else {
		return '/'
	}
}

export function getNodeByPath(root, path) {
	const dirs = filter(path.split('/'), dir => dir)
	let node = root
	each(dirs, dir => {
		if (node.children === undefined) {
			node.children = [{
				name: dir
			}]
		}
		const matchChild = find(node.children, child => child.name === dir)
		if (matchChild) node = matchChild
	})
	return node
}

export function setNodeChildren(node, files) {
	each(files, file => {
		const child = find(node.children, child => child.name === file.name)
		if (child) {
			file.isExpanded = child.isExpanded
			file.children = child.children
		}
	})
	node.children = files
}

export function simpleMatch(str, term) {
	return str.toUpperCase().includes(term.toUpperCase())
}

export function getParamsFromURL() {
	const paramsList = window.location.search.substr(1).split('&')
	return reduce(paramsList, (result, item) => {
		let key, value
		[key, value] = item.split('=')
		result[key] = value
		return result
	}, {})
}

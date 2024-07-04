import { join } from 'path'
import * as vscode from 'vscode'

const findCurrentFolder = (folders: string[], activeFile: string) => {
	if (folders.length === 1) {
		return folders[0]
	}
	const activePath = activeFile
		.split('/')
		.filter(f => f)
		.map((_, i, arr) => (i === 0 ? '' : '/' + arr.slice(0, i).join('/')))
		.filter(f => f)
	const folder = folders.filter(f => activePath.includes(f))
	if (folder.length === 1) {
		return folder[0]
	}
}

export const findTsBtpl = (
	activeFile: string,
	workFolders: readonly vscode.WorkspaceFolder[]
) => {
	if (workFolders) {
		const curPath = findCurrentFolder(
			workFolders.map(w => w.uri.fsPath),
			activeFile
		)
		if (!curPath) {
			console.warn('当前编辑文件不在项目中')
			return
		}
		if (!/\/sources\/[a-zA-Z-_0-9]*\.btpl/.test(activeFile)) {
			console.log('activeFile: ', activeFile)
			console.warn('当前文件未在工作区')
			return
		}
		return {
			tsFilePath: join(curPath, 'btpl-env.d.ts'),
			name: activeFile.split('/').slice(-1).join('').split('.')[0]
		}
	}
}

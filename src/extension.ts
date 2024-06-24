import * as vscode from 'vscode'
import { findTsBtpl } from './util'
import { BtplEnv } from '@biuxiu/template'
import { readFileSync } from 'fs'

export function activate(context: vscode.ExtensionContext) {
	const workFolders = vscode.workspace.workspaceFolders
	const updateDisposable = vscode.workspace.onWillSaveTextDocument(
		async event => {
			if (workFolders && event.document.uri.fsPath.endsWith('.btpl')) {
				const text = event.document.getText()
				const moduleInfo = findTsBtpl(
					event.document.uri.fsPath,
					workFolders
				)
				if (!moduleInfo) {
					return
				}
				const env = new BtplEnv(moduleInfo.tsFilePath)
				await env.update(moduleInfo.name, text)
				env.save()
			}
		}
	)

	const deleteDisposable = vscode.workspace.onDidDeleteFiles(event => {
		if (workFolders) {
			const files = event.files
				.map(f => f.fsPath)
				.filter(f => f.endsWith('.btpl'))
			for (const file of files) {
				const moduleInfo = findTsBtpl(file, workFolders)
				if (!moduleInfo) {
					continue
				}
				const env = new BtplEnv(moduleInfo.tsFilePath)
				env.remove(moduleInfo.name)
				env.save()
			}
		}
	})

	const renameDisposable = vscode.workspace.onDidRenameFiles(async event => {
		if (workFolders) {
			const deleteFiles = event.files
				.filter(f => {
					return (
						f.oldUri.fsPath.endsWith('.btpl') &&
						!f.newUri.fsPath.endsWith('.btpl')
					)
				})
				.map(f => f.oldUri.fsPath)

			for (const file of deleteFiles) {
				const moduleInfo = findTsBtpl(file, workFolders)
				if (!moduleInfo) {
					continue
				}
				const env = new BtplEnv(moduleInfo.tsFilePath)
				env.remove(moduleInfo.name)
				env.save()
			}
			const renameFiles = event.files
				.filter(f => {
					return (
						f.oldUri.fsPath.endsWith('.btpl') &&
						f.newUri.fsPath.endsWith('.btpl')
					)
				})
				.map(f => [f.oldUri.fsPath, f.newUri.fsPath])

			for (const [oldFile, newFile] of renameFiles) {
				const oldModuleInfo = findTsBtpl(oldFile, workFolders)
				if (!oldModuleInfo) {
					continue
				}
				const newModuleInfo = findTsBtpl(newFile, workFolders)
				if (!newModuleInfo) {
					continue
				}
				if (oldModuleInfo.tsFilePath !== newModuleInfo.tsFilePath) {
					continue
				}
				const env = new BtplEnv(newModuleInfo.tsFilePath)
				env.rename(oldModuleInfo.name, newModuleInfo.name)
				env.save()
			}

			const addFiles = event.files
				.filter(f => {
					return (
						!f.oldUri.fsPath.endsWith('.btpl') &&
						f.newUri.fsPath.endsWith('.btpl')
					)
				})
				.map(f => f.newUri.fsPath)

			for (const file of addFiles) {
				const moduleInfo = findTsBtpl(file, workFolders)
				if (!moduleInfo) {
					continue
				}
				const env = new BtplEnv(moduleInfo.tsFilePath)
				const source = readFileSync(file, 'utf8')
				env.update(moduleInfo.name, source)
				env.save()
			}
		}
	})

	context.subscriptions.push(
		updateDisposable,
		deleteDisposable,
		renameDisposable,
		vscode.languages.registerCompletionItemProvider(
			'btpl',
			{
				provideCompletionItems(document, position, token, context) {
					const completionItems: vscode.CompletionItem[] = []
					const start = new vscode.Position(position.line, 0)
					const range = new vscode.Range(start, position)
					const text = document.getText(range)

					if (text.endsWith('{%')) {
						const item = new vscode.CompletionItem(
							'Btpl Block',
							vscode.CompletionItemKind.Snippet
						)
						completionItems.push(item)
					}
					return completionItems
				}
			},
			'{',
			'i',
			'e'
		)
	)
}

export function deactivate() {}

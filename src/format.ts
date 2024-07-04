import * as vscode from 'vscode'
import { FormatParser } from '@biuxiu/template'

const FormatBtpl = vscode.languages.registerDocumentFormattingEditProvider(
	{
		language: 'btpl'
	},
	{
		provideDocumentFormattingEdits(document) {
			const source = document.getText()
			const formatted = new FormatParser(source).format()

			let i = 0
			while (
				i < source.length &&
				i < formatted.length &&
				source[i] === formatted[i]
			) {
				++i
			}
			let j = 0
			while (
				i + j < source.length &&
				i + j < formatted.length &&
				source[source.length - j - 1] ===
					formatted[formatted.length - j - 1]
			) {
				++j
			}
			const newText = formatted.substring(i, formatted.length - j)
			const pos0 = document.positionAt(i)
			const pos1 = document.positionAt(source.length - j)
			const minimalEdit = vscode.TextEdit.replace(
				new vscode.Range(pos0, pos1),
				newText
			)
			return [minimalEdit]
		}
	}
)

export { FormatBtpl }

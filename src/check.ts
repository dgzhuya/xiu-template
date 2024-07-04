import { TypeKeyParser } from '@biuxiu/template'
import * as vscode from 'vscode'

const collection = vscode.languages.createDiagnosticCollection('btpl')

if (vscode.window.activeTextEditor) {
	checkError(vscode.window.activeTextEditor.document, collection)
}

function checkError(
	document: vscode.TextDocument,
	collection: vscode.DiagnosticCollection
) {
	if (document.languageId !== 'btpl') {
		return
	}
	const diagnostics: vscode.Diagnostic[] = []
	const text = document.getText()
	const err = new TypeKeyParser(text).checkError()
	if (err) {
		diagnostics.push({
			severity: vscode.DiagnosticSeverity.Error,
			range: new vscode.Range(
				document.positionAt(err.start),
				document.positionAt(err.end)
			),
			message: err.msg,
			source: 'btpl'
		})
	}
	collection.set(document.uri, diagnostics)
}

const active = vscode.window.onDidChangeActiveTextEditor(editor => {
	if (editor) {
		checkError(editor.document, collection)
	}
})
const didChange = vscode.workspace.onDidChangeTextDocument(event => {
	checkError(event.document, collection)
})
const close = vscode.workspace.onDidCloseTextDocument(document => {
	collection.delete(document.uri)
})

export const CheckDisposables = [active, didChange, close]

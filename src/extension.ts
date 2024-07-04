import * as vscode from 'vscode'
import { CodeCompletion } from './completion'
import { BtplDTSDisposables } from './key-tools'
import { CheckDisposables } from './check'
import { BtplSyntax } from './syntax'
import { FormatBtpl } from './format'

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		BtplSyntax,
		CodeCompletion,
		FormatBtpl,
		...BtplDTSDisposables,
		...CheckDisposables
	)
}

export function deactivate() {}

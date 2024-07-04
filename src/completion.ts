import * as vscode from 'vscode'

export const CodeCompletion = vscode.languages.registerCompletionItemProvider(
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
	'e',
	'f',
	'a',
	'o'
)

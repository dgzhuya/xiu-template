import * as vscode from 'vscode'
import { SyntaxParser, TokenTypes, TokenModifiers } from '@biuxiu/template'

const legend = new vscode.SemanticTokensLegend(TokenTypes, TokenModifiers)

export const BtplSyntax =
	vscode.languages.registerDocumentSemanticTokensProvider(
		{ language: 'btpl' },
		{
			provideDocumentSemanticTokens(document) {
				const source = document.getText()
				const tokenBuilder = new vscode.SemanticTokensBuilder(legend)
				const list = new SyntaxParser(source).getSyntaxes()
				list.forEach(({ start, end, type }) => {
					const range = new vscode.Range(
						document.positionAt(start),
						document.positionAt(end)
					)
					tokenBuilder.push(range, type)
				})
				return tokenBuilder.build()
			}
		},
		legend
	)

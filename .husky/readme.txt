Run to set up linting precommit hook (might be necessary to rerun this if it is failing):
	yarn husky add .husky/pre-commit "yarn lint"

On Unix, run the following to ensure the precommit hook is set as executable:
	chmod ug+x .husky/* && chmod ug+x .git/hooks/*

#!/usr/bin/env bash

check_and_install_tools() {
    local tool_name="$1"
    local install_command="$2"

    echo "***** Checking if $tool_name installed ******"
    if ! [ -x "$(command -v $tool_name)" ]; then
        echo "Error: $tool_name is not installed. Installing ..."
        $install_command
        if [ $? -ne 0 ]; then
            echo "Error: Failed to install $tool_name" >&2
            exit 1
        fi
    fi
}

if [[ "$OSTYPE" =~ ^darwin ]]; then
    check_and_install_tools "pre-commit" "brew install pre-commit"
    check_and_install_tools "gitleaks" "brew install gitleaks"
    
    pre-commit install
    pre-commit install --hook-type commit-msg
else
    echo "***** OS not supported ******"
fi

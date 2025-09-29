This is an app i build to track my basketabll shooting practice.

use vue.js and tailwind.css.

# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

npm run dev

Git command.

# 1) Quick, readable overview of history

git log --oneline --graph --decorate --all

# - --oneline: short SHA + subject

# - --graph: ASCII branch graph

# - --decorate: show branch/tags

# - --all: include all branches (omit if you only want current branch)

# Comparing without updating remote refs can be misleading

git fetch --prune origin
git diff origin/main

Hard reset
git reset --hard HEAD~1
git push --force origin main

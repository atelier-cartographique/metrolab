#!/bin/bash


LESSC=./node_modules/.bin/lessc
STYLES=$*


for STYLE in  $STYLES;
	do
		${LESSC} static/${STYLE}.less static/${STYLE}.css
	done

# Example

To run this example:

- `npm install` or `yarn`
- `npm start` or `yarn start`

pdfseparate mec101_learn_to_play.pdf ./temp/%d.pdf

claude --print --allowed-tools="['Read']" prompt="Read the contents of 31.pdf and convert to markdown, ignore any legal disclaimers and proof of purchase in the PDF. The correct reading order is the left column, then the right column of each page." > ./31.md; echo "31 done";

find . -name "*.pdf" -type f -exec sh -c 'claude --print --allowed-tools="['Read']" prompt="Read the contents of $1 and convert to markdown, ignore any legal disclaimers and proof of purchase in the PDF. The correct reading order is the left column, then the right column of each page." > $1.md; echo "$1 done";' \_ {} \;

find . -name "*.md" -type f | sort | xargs cat > combined.md
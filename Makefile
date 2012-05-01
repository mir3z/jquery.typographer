JSHINT_CONFIG = jshint-config.json
SRC_DIR = src
TEST_DIR = test
JSHINT_BIN = jshint
BROWSER = firefox

jshint: jshint_presence
	@echo "Running JSHint...\n"
	@${JSHINT_BIN} ${SRC_DIR}/*.js --config ${JSHINT_CONFIG}
	@echo "Congratulation!"

jshint_presence:
	@type ${JSHINT_BIN} >/dev/null 2>&1 \
	|| { echo >&2 "I require ${JSHINT_BIN} but it's not installed. Aborting."; exit 1; }

test:
	@${BROWSER} ${TEST_DIR}/index.html

.PHONY: test jshint jshint_presence

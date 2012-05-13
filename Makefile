SRC_DIR = src
HYPH_DEF_PL = hyph-pl.js
SRC_TYPOGRAPHER = jquery.typographer.js
SRC_COMMON = jquery.typographer.common.js
SRC_ORPHAN = jquery.typographer.orphan.js
SRC_HYPHEN = jquery.typographer.hyphen.js
SRC_PUNCT = jquery.typographer.punctuation.js
SRC_FILES = \
	${SRC_DIR}/${SRC_TYPOGRAPHER}\
	${SRC_DIR}/${SRC_COMMON}\
	${SRC_DIR}/${SRC_ORPHAN}\
	${SRC_DIR}/${SRC_HYPHEN}\
	${SRC_DIR}/${SRC_PUNCT}

DIST_DIR = dist
DIST_PACK = ${DIST_DIR}/$(SRC_TYPOGRAPHER:.js=.min.pack.js)
DIST_HYPH_DEF_PL = ${DIST_DIR}/$(HYPH_DEF_PL:.js=.min.js)
DIST_HYPHEN = ${DIST_DIR}/$(SRC_HYPHEN:.js=.min.js)
DIST_ORPHAN = ${DIST_DIR}/$(SRC_ORPHAN:.js=.min.js)
DIST_PUNCT = ${DIST_DIR}/$(SRC_PUNCT:.js=.min.js)

LIC = LICENSE

TARGETS = ${DIST_PACK} ${DIST_HYPH_DEF_PL} ${DIST_HYPHEN} ${DIST_ORPHAN} ${DIST_PUNCT}

EXT_DIR = ext
CLOSURE_COMPILER = compiler.jar

TEST_DIR = test
BROWSER = firefox

JSHINT_CONFIG = jshint-config.json
JSHINT_BIN = jshint

all: ${TARGETS}

${DIST_PACK}: ${LIC} ${SRC_FILES}
	@echo '###' $@
	@mkdir -p ${DIST_DIR}
	@java -jar ${EXT_DIR}/${CLOSURE_COMPILER} --js $^ --js_output_file $@

${DIST_HYPH_DEF_PL}: ${LIC} ${SRC_DIR}/${HYPH_DEF_PL}
	@echo '###' $@
	@mkdir -p ${DIST_DIR}
	@java -jar ${EXT_DIR}/${CLOSURE_COMPILER} --js $^ --js_output_file $@

${DIST_HYPHEN}: ${LIC} ${SRC_DIR}/${SRC_COMMON} ${SRC_DIR}/${SRC_HYPHEN}
	@echo '###' $@
	@mkdir -p ${DIST_DIR}
	@java -jar ${EXT_DIR}/${CLOSURE_COMPILER} --js $^ --js_output_file $@

${DIST_ORPHAN}: ${LIC} ${SRC_DIR}/${SRC_COMMON} ${SRC_DIR}/${SRC_ORPHAN}
	@echo '###' $@
	@mkdir -p ${DIST_DIR}
	@java -jar ${EXT_DIR}/${CLOSURE_COMPILER} --js $^ --js_output_file $@

${DIST_PUNCT}: ${LIC} ${SRC_DIR}/${SRC_COMMON} ${SRC_DIR}/${SRC_PUNCT}
	@echo '###' $@
	@mkdir -p ${DIST_DIR}
	@java -jar ${EXT_DIR}/${CLOSURE_COMPILER} --js $^ --js_output_file $@

jshint: jshint_presence
	@echo "Running JSHint...\n"
	@${JSHINT_BIN} ${SRC_FILES} --config ${JSHINT_CONFIG}
	@echo "Congratulation!"

jshint_presence:
	@type ${JSHINT_BIN} >/dev/null 2>&1 \
	|| { echo >&2 "I require ${JSHINT_BIN} but it's not installed. Aborting."; exit 1; }

test:
	${BROWSER} ${TEST_DIR}/*.html

clean:
	rm -rf ${DIST_DIR}

.PHONY: test jshint jshint_presence all

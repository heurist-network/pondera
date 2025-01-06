import logging
import os
import sys

# create logger
logger = logging.getLogger("pondera")
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logger.setLevel(getattr(logging, log_level))

# create formatter for structured logging
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")

# create console handler
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(getattr(logging, log_level))
console_handler.setFormatter(formatter)

# add handler to logger
logger.addHandler(console_handler)

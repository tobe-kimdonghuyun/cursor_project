@echo off
rem Force UTF-8 encoding for JVM to prevent Korean text corruption
rem   -Dfile.encoding              : file I/O and log file encoding
rem   -Dstdout.encoding            : console stdout encoding (Java 17+)
rem   -Dstderr.encoding            : console stderr encoding (Java 17+)
rem   -Djavax.servlet.request.encoding : HTTP request body (POST) encoding
set "JAVA_OPTS=%JAVA_OPTS% -Dfile.encoding=UTF-8 -Dstdout.encoding=UTF-8 -Dstderr.encoding=UTF-8"
set "JAVA_OPTS=%JAVA_OPTS% -Djavax.servlet.request.encoding=UTF-8"

#!/bin/bash

function csv_to_sqlite() {
  local database_file_name="$1"
  local file_name="$2"
  local table_name="$3"
  (echo .separator ,; echo .import --skip 1 $file_name $table_name) | sqlite3 $database_file_name
}

database_file_name=$1
file_name=$2
table_name=$3

csv_to_sqlite "$database_file_name" "$file_name" "$table_name"


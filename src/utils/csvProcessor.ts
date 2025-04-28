import { readFile, writeFile } from 'fs/promises';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify';

interface CSVRow {
  [key: string]: string;
}

interface ProcessingOptions {
  inputPath: string;
  outputPath: string;
  filterColumn?: string;
  filterValue?: string;
  selectedColumns?: string[];
}

export class CSVProcessor {
  private data: CSVRow[] = [];

  /**
   * Reads and processes a CSV file according to the specified options
   * @param options Processing configuration options
   * @returns Promise<void>
   */
  async processCSV(options: ProcessingOptions): Promise<void> {
    try {
      // Read the input file
      const fileContent = await readFile(options.inputPath, 'utf-8');
      
      // Parse CSV content
      this.data = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
      });

      // Apply filters if specified
      if (options.filterColumn && options.filterValue) {
        this.data = this.data.filter(row => 
          row[options.filterColumn!] === options.filterValue
        );
      }

      // Select specific columns if specified
      if (options.selectedColumns && options.selectedColumns.length > 0) {
        this.data = this.data.map(row => {
          const filteredRow: CSVRow = {};
          options.selectedColumns!.forEach(column => {
            if (column in row) {
              filteredRow[column] = row[column];
            }
          });
          return filteredRow;
        });
      }

      // Convert back to CSV and write to output file
      const outputContent = stringify(this.data, {
        header: true,
        columns: options.selectedColumns || Object.keys(this.data[0] || {})
      });

      await writeFile(options.outputPath, outputContent, 'utf-8');
      
      console.log(`Successfully processed CSV file. Output written to ${options.outputPath}`);
    } catch (error) {
      console.error('Error processing CSV file:', error);
      throw error;
    }
  }

  /**
   * Returns the current processed data
   * @returns CSVRow[]
   */
  getData(): CSVRow[] {
    return this.data;
  }
} 
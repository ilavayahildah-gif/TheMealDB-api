import fs from "fs";
import parse from "csv-parse";
import {resolve} from "path";

export interface ParsedRow{
    [key:string]: string;
}

export const parseCSV = async(filepath:string): Promise<ParsedRow[]> =>{
    return new Promise((resolve, reject) => {
        const rows: ParsedRow[] = [];

        fs.createReadStream(filepath)
        .pipe(parse({columns: true, skip_empty_lines: true}))
        .on("data", (row: ParsedRow) => rows.push(row))
        .on("end", () => resolve(rows))
        .on("error", (error: Error) => reject(error));
    });
};

export const convertCSVtoJSON =(parsedData: ParsedRow[]) =>{
    let compliedData: Record<string, string>[] = [];

    console.log("parsedData", parsedData);

    for (let i=1; i<=parsedData.length; i++){
        const header_values= String(parsedData[0]).split(",");
        const currentRow= parsedData[i];

        const currentProduct: Record<string, string> ={};

        String(currentRow)
        .split(",")
        .forEach((value, index) =>{
            let key:string= String(header_values[index]).toLowerCase();
            currentProduct[key]=value;
        });
        compliedData.push(currentProduct);
    }
    return compliedData;
};
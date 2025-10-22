import express,{ Request, Response } from "express";
import path from "path";
import fs from "fs";
import { error } from "console";
import {format} from "@fast-csv/format";
import { upload } from "../middleware/upload.middleware";
import { convertCSVtoJSON, parseCSV } from "../utils/csv.parse.util";
import { z } from "zod";

class UploadController {
  static downloadFile = async (req: Request, res: Response) => {
    try {
      const { filename } = req.params;
      const filePath = path.resolve(__dirname, "../uploads", filename); // Use resolve instead of join

      console.log("Downloading file from:", filePath);

      if (!fs.existsSync(filePath)) {
        console.log("File not found:", filePath);
        return res.status(404).json({ message: "File not found" });
      }

      // Send the file
      return res.download(filePath, filename, (err) => {
        if (err) {
          console.error("Error during download:", err);
          if (!res.headersSent) {
            return res.status(500).json({ message: "Error downloading file" });
          }
        }
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

  static uploadSingleFile = async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ message: "No File Uploaded" });

    const { mimetype, path: filePath, filename } = req.file;

    if (mimetype === "text/csv") {
      try {
        const parsedData = await parseCSV(filePath);
        const compliedData= convertCSVtoJSON(parsedData);

        return res.status(200).json({
          message: "CSV uploaded and parsed successfully",
          file: { filename, path: filePath },
          data: parsedData,
        });
      } catch (error) {
        console.error("Error parsing CSV:", error);
        return res.status(500).json({ message: "Failed to parse CSV" });
      }
    }

    res.status(200).json({
      message: "File uploaded successfully",
      file: {
        filename: req.file.filename,
        path: req.file.path,
      },
    });
  };

  static uploadMultipleFiles = async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({message: "No files uploaded"});

    const {mimetype, path:filePath, filename } =req.file;

    if (mimetype=="text/csv"){
      try{
        const parsedData= await parseCSV(filePath);
        const compliedData= convertCSVtoJSON(parsedData);

        return res.status(200).json({
          message: "CSV uploaded and parsed successfully",
          file: {filename, path:filePath},
          data: parsedData,
        });
      } catch (error){
        console.error("Error parsing CSV:", error);
        return res.status(500).json({ message: "Failed to parse CSV"});
      }
    }

    res.status(200).json({
      message: "Files uploaded successfully",
      file:{
        filename: req.file.filename,
        path:req.file.path,
      },
    });
  };
}


export default UploadController;

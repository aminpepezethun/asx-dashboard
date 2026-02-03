import { Parser } from "@json2csv/plainjs";

export default function jsonToCsv(data: any[]) {
    try {
        const parser = new Parser();
        return parser.parse(data);
    } catch (error) {
        console.error("Failed to convert JSON to CSV: ", error);
        return "";
    }
}
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { exec } = require("child_process");

const app = express();
const upload = multer({ dest: "uploads/" });
const PORT = process.env.PORT || 3000;

const corsOptions = {
	origin: [process.env.CLIENT_URL],
};
app.use(cors(corsOptions));

app.post("/docxtopdf", upload.single("file"), (req, res) => {
	if (!req.file) return res.status(400).json({ error: "No file" });
	console.log(req.file);

	exec(
		`soffice --headless --convert-to pdf --outdir uploads ${req.file.path}`,
		(error, stdout, stderr) => {
			if (error) {
				console.error(`Conversion failed: ${stdout}`);
				console.error(`Stderr: ${stderr}`);
				return res.status(500).json({ error: "Conversion failed" });
			}

			res.download(
				`uploads/${req.file.filename}.pdf`,
				`${req.file.originalname}.pdf`
			);
		}
	);
});

app.listen(PORT, () => {});
console.log("Server started on port 8080");

import { useState } from "react";
import axios from "axios";

function App() {
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);

	const convert = async () => {
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);

		setLoading(true);

		try {
			const response = await axios.post(
				"http://localhost:8080/docxtopdf",
				formData,
				{
					responseType: "blob",
				}
			);

			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.download = `${file.name.split(".")[0]}.pdf`;
			link.click();
		} catch (err) {
			alert("Conversion failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<input
				type="file"
				accept=".docx"
				onChange={(e) => setFile(e.target.files?.[0] || null)}
			/>
			<button onClick={convert} disabled={!file || loading}>
				{loading ? "Downloading..." : "Downlaod as PDF"}
			</button>
		</div>
	);
}

export default App;

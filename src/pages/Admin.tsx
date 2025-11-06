import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import quantumbotLogo from "@/assets/quantumbot-logo.png";

const Admin = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Upload successful",
          description: data.message || "Document uploaded and processed successfully",
        });
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/reset", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Reset successful",
          description: data.message || "Chatbot knowledge base has been reset",
        });
      } else {
        throw new Error("Reset failed");
      }
    } catch (error) {
      toast({
        title: "Reset failed",
        description: "Failed to reset chatbot. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={quantumbotLogo} alt="QuantumBot" className="h-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">QuantumBot</h1>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Back to Chat
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Upload Section */}
          <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Upload className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Upload Training Documents</h2>
            </div>
            
            <div className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer block"
                >
                  <span className="text-sm text-foreground">
                    {selectedFile ? selectedFile.name : "Click to select a document"}
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".txt,.pdf,.doc,.docx"
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: TXT, PDF, DOC, DOCX
                </p>
              </div>

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload & Train
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Reset Section */}
          <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">Reset Training Data</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This will clear all trained documents and reset the chatbot to its default state.
            </p>
            <Button
              onClick={handleReset}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              Reset Chatbot
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;

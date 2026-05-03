import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, Loader2, Sparkles, Stethoscope, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api, getErrorMessage } from '@/lib/api/client';
import { cn } from '@/lib/utils';

interface DiagnoseResult {
  status?: string;
  disease?: string;
  confidence?: number;
  treatment?: string;
  raw?: unknown;
}

export function PlantDoctorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnoseResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  });

  const diagnose = async () => {
    if (!file) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      // Backend AI passthrough — see backend_pim/src/ai/ai.controller.ts
      const data = await api
        .post('/ai/diagnose-asset', fd)
        .then((r) => r.data as Record<string, unknown>);
      setResult({
        disease: (data.disease ?? data.label ?? data.prediction) as string | undefined,
        confidence: data.confidence as number | undefined,
        treatment: (data.treatment ?? data.recommendation) as string | undefined,
        status: (data.status ?? 'OK') as string,
        raw: data,
      });
      toast.success('Diagnosis complete');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not run diagnosis'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Stethoscope className="size-5" />}
        title="AI Plant Doctor"
        description="Upload a photo of a leaf, fruit, or stem to detect diseases instantly."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload a photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              {...getRootProps()}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-all',
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-bg/40 hover:border-primary/50',
              )}
            >
              <input {...getInputProps()} />
              <Upload className="size-8 text-primary" />
              <p className="text-sm font-medium text-ink">
                Drop an image here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
            </div>
            {preview ? (
              <div className="overflow-hidden rounded-2xl border border-border/60">
                <img src={preview} alt="Preview" className="max-h-72 w-full object-contain" />
              </div>
            ) : null}
            <Button
              onClick={diagnose}
              disabled={!file || submitting}
              variant="gradient"
              size="lg"
              className="w-full"
              loading={submitting}
            >
              {!submitting && <Sparkles className="size-4" />} Diagnose
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diagnosis</CardTitle>
          </CardHeader>
          <CardContent>
            {submitting ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                <Loader2 className="size-6 animate-spin text-primary" />
                <p className="text-sm">Analyzing your image…</p>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant={result.status === 'OK' ? 'success' : 'warning'}>
                    {result.status}
                  </Badge>
                  {typeof result.confidence === 'number' ? (
                    <span className="text-sm text-muted-foreground">
                      Confidence: {(result.confidence * 100).toFixed(1)}%
                    </span>
                  ) : null}
                </div>
                {result.disease ? (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Detected</p>
                    <p className="text-h3 font-semibold text-ink">{result.disease}</p>
                  </div>
                ) : null}
                {result.treatment ? (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Recommended action
                    </p>
                    <p className="mt-1 text-sm text-ink">{result.treatment}</p>
                  </div>
                ) : null}
                <details className="text-xs text-muted-foreground">
                  <summary className="cursor-pointer">Show raw response</summary>
                  <pre className="mt-2 overflow-auto rounded-lg bg-bg/60 p-3">
{JSON.stringify(result.raw, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                <ImageIcon className="size-8" />
                <p className="text-sm">Upload an image and run diagnose to see results.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

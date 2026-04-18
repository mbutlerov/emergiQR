'use client'

import { useRef, useCallback } from 'react'
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'
import { Download, ExternalLink, RefreshCw } from 'lucide-react'
import { getPublicUrl } from '@/lib/utils'

interface Props {
  publicId: string
  fullName: string
}

export default function QRDisplay({ publicId, fullName }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const publicUrl = getPublicUrl(publicId)

  const downloadPNG = useCallback(() => {
    // Find canvas inside our ref
    const canvas = canvasRef.current?.querySelector('canvas') as HTMLCanvasElement | null
    if (!canvas) return

    // Create padded version
    const padding = 32
    const size = canvas.width + padding * 2
    const offscreen = document.createElement('canvas')
    offscreen.width = size
    offscreen.height = size + 60 // extra for label
    const ctx = offscreen.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, offscreen.width, offscreen.height)
    ctx.drawImage(canvas, padding, padding)

    // Add label
    ctx.fillStyle = '#111118'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('EmergiQR — Emergencia', size / 2, size + 22)
    ctx.font = '11px monospace'
    ctx.fillStyle = '#555570'
    ctx.fillText(publicUrl, size / 2, size + 44)

    const link = document.createElement('a')
    link.download = `emergiqr-qr-${publicId.slice(0, 8)}.png`
    link.href = offscreen.toDataURL('image/png')
    link.click()
  }, [publicId, publicUrl])

  const downloadSVG = useCallback(() => {
    const svgEl = document.querySelector('#qr-svg-export svg')
    if (!svgEl) return
    const serializer = new XMLSerializer()
    let svgStr = serializer.serializeToString(svgEl)
    svgStr = svgStr.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `emergiqr-qr-${publicId.slice(0, 8)}.svg`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }, [publicId])

  return (
    <div className="space-y-6">
      {/* QR Card */}
      <div className="card flex flex-col items-center gap-6">
        {/* Visual QR */}
        <div className="bg-white p-5 rounded-xl shadow-lg">
          {/* Canvas version for PNG export (hidden) */}
          <div ref={canvasRef} className="hidden">
            <QRCodeCanvas
              value={publicUrl}
              size={300}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* SVG version for display */}
          <QRCodeSVG
            value={publicUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Label under QR */}
        <div className="text-center">
          <p className="font-display font-bold text-text-primary">{fullName}</p>
          <p className="text-text-muted text-xs font-mono mt-1 break-all">{publicUrl}</p>
        </div>

        {/* Download buttons */}
        <div className="flex flex-wrap gap-3 justify-center w-full">
          <button
            onClick={downloadPNG}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Descargar PNG
          </button>
          <button
            onClick={downloadSVG}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Descargar SVG
          </button>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Ver página pública
          </a>
        </div>
      </div>

      {/* Hidden SVG for export */}
      <div id="qr-svg-export" className="hidden">
        <QRCodeSVG value={publicUrl} size={400} level="H"/>
      </div>

      {/* Print card */}
      <div className="card border-dashed border-border-accent">
        <h3 className="font-display font-semibold text-text-primary text-sm mb-3">
          Opciones de uso
        </h3>
        <ul className="space-y-2 text-sm font-body text-text-secondary">
          {[
            '🏍️ Pegalo en tu casco (interior o exterior)',
            '🪪 Imprimilo y colocalo en tu billetera',
            '🔑 Agregalo a tu llavero con una tarjeta plastificada',
            '⌚ Pedí una pulsera o pegatina resistente al agua',
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

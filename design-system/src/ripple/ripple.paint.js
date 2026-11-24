// Render the two slopes of a raised circular crest under a light at twelve o'clock.
registerPaint('neui-ripple', class {
  static get inputProperties() {
    return ['--neui-waves', '--neui-highlight', '--neui-shade']
  }

  paint(ctx, size, properties) {
    const light = properties.get('--neui-highlight').toString().trim()
    const shadow = properties.get('--neui-shade').toString().trim()
    for (const wave of properties.get('--neui-waves').toString().split(',')) {
      const [px, py, progress, energy] = wave.trim().split(/\s+/).map(parseFloat)
      if (!(progress > 0 && progress < 1 && energy > 0)) continue
      const x = size.width * px / 100, y = size.height * py / 100
      const reach = Math.hypot(Math.max(x, size.width - x), Math.max(y, size.height - y))
      const radius = progress * reach
      const width = Math.min(8, radius * .85)
      const slope = (north, south) => {
        const gradient = ctx.createLinearGradient(x, y - radius, x, y + radius)
        gradient.addColorStop(0, north)
        gradient.addColorStop(.5, 'transparent')
        gradient.addColorStop(1, south)
        return gradient
      }
      const outer = slope(light, shadow), inner = slope(shadow, light)
      // Sample the derivative of a smooth bump across its width. The inner and
      // outer slopes face opposite directions; the undisturbed surface stays clear.
      const steps = Math.ceil(width)
      ctx.lineWidth = width / steps
      for (let i = -steps; i < steps; i++) {
        const offset = (i + .5) / steps
        ctx.globalAlpha = energy * Math.abs(Math.sin(Math.PI * offset))
        ctx.strokeStyle = offset > 0 ? outer : inner
        ctx.beginPath()
        ctx.arc(x, y, radius + width * offset, 0, 2 * Math.PI)
        ctx.stroke()
      }
    }
  }
})

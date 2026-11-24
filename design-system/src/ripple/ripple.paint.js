// A monochrome mask; the surface supplies its theme color in ordinary CSS.
registerPaint('neui-ripple', class {
  static get inputProperties() {
    return ['--neui-ripple-progress', '--neui-ripple-x', '--neui-ripple-y']
  }

  paint(ctx, size, properties) {
    const progress = Math.max(0, Math.min(1, properties.get('--neui-ripple-progress').value))
    const x = size.width * properties.get('--neui-ripple-x').value / 100
    const y = size.height * properties.get('--neui-ripple-y').value / 100
    const radius = progress * Math.hypot(Math.max(x, size.width - x), Math.max(y, size.height - y))
    if (!(radius > 0)) return
    // At progress 1 the crest reaches the farthest corner. Match the CSS fallback.
    const mask = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.125)
    mask.addColorStop(.64, 'rgba(0,0,0,.18)')
    mask.addColorStop(1 / 1.125, 'black')
    mask.addColorStop(1, 'transparent')
    ctx.fillStyle = mask
    ctx.fillRect(0, 0, size.width, size.height)
  }
})

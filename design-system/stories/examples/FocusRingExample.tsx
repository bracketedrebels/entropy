export function FocusRingExample({ duration = 'duration-1000', easing = 'ease-out' }: {
  easing?: 'ease-out' | 'ease-linear' | 'ease-in-out'
  duration?: 'duration-500' | 'duration-1000' | 'duration-1500'
}) {
  return <div className="neui-example grid gap-4">
    <label className={`neui-row neui-entry neui-ripple neui-focus-ring ${duration} ${easing}`}>
      <span aria-hidden="true" className="neuicon-pencil neui-row-area-leading place-self-center" />
      <input className="neui-field-input neui-row-area-content" aria-label="Волна и контур" placeholder="Волна и контур" />
    </label>
    <button type="button" className={`neui-row neui-focus-ring ${duration} ${easing}`}>
      <span className="neui-row-area-content">Только контур</span>
    </button>
    <button type="button" className={`neui-row neui-ripple ${duration} ${easing}`}>
      <span className="neui-row-area-content">Только волна</span>
    </button>
  </div>
}

import { createElement, type ComponentType } from 'react'

export type TemplateData = Record<string, unknown>

export interface TemplateEntry<TData extends object = TemplateData> {
  component: ComponentType<TData>
  subject: string | ((data: TData) => string)
  displayName?: string
  previewData?: TData
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Adapt a template with specific props to the shared runtime registry type.
 * The call site supplies data from the matching template integration.
 */
export function defineTemplate<TData extends object>(
  entry: TemplateEntry<TData>,
): TemplateEntry {
  const component: ComponentType<TemplateData> = (data) =>
    createElement(entry.component, data as TData)
  const subjectTemplate = entry.subject
  const subject: TemplateEntry['subject'] =
    typeof subjectTemplate === 'function'
      ? (data) => subjectTemplate(data as TData)
      : subjectTemplate

  return { ...entry, component, subject }
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 *
 * Example:
 *   import WelcomeEmail from './welcome'
 *   // Add to TEMPLATES using defineTemplate({ component: WelcomeEmail, subject: 'Welcome' }).
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  // Add templates here as they are created, e.g.:
  // 'welcome': defineTemplate({ component: WelcomeEmail, subject: 'Welcome' }),
}

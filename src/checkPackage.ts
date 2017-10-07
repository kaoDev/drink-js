export type PackageAvailable = { packageAvailable: boolean; downloads: number }
export const checkPackage = async (name: string): Promise<PackageAvailable> => {
  try {
    const result = await window.fetch(
      `https://api.npmjs.org/downloads/point/last-month/${name}`
    )

    const json = (await result.json()) as {
      downloads?: number
      start?: string
      end?: string
      package?: typeof name
    } & { error?: string }

    if (typeof json.downloads === 'number' && json.package !== undefined) {
      return { packageAvailable: true, downloads: json.downloads }
    }
    return { packageAvailable: false, downloads: 0 }
  } catch (e) {
    console.log(e)
    return { packageAvailable: false, downloads: 0 }
  }
}

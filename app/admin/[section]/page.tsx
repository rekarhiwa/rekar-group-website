import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ReadonlyBanner } from "@/components/admin/readonly-banner";
import { InlineCollectionManager } from "@/components/admin/inline-collection-manager";
import { MessageManager } from "@/components/admin/message-manager";
import { ServerForm } from "@/components/admin/server-form";
import { ActionButton } from "@/components/admin/action-button";
import {
  getActivityData,
  getCategoriesData,
  getCollectionRecords,
  getMediaData,
  getMessagesData,
  getNavigationData,
  isAdminDemoMode,
  getSectionConfig,
  getSettingsData,
  getTrashData,
  getUsersData,
} from "@/lib/admin/data";
import { formatDate } from "@/lib/utils";
import { saveClientAction, deleteClientAction } from "@/app/admin/actions/clients";
import {
  saveTestimonialAction,
  deleteTestimonialAction,
} from "@/app/admin/actions/testimonials";
import { saveProcessAction, deleteProcessAction } from "@/app/admin/actions/process";
import { saveStatAction, deleteStatAction } from "@/app/admin/actions/stats";
import {
  saveProjectCategoryAction,
  savePostCategoryAction,
  deleteProjectCategoryAction,
  deletePostCategoryAction,
} from "@/app/admin/actions/categories";
import { saveTagAction, deleteTagAction } from "@/app/admin/actions/tags";
import {
  updateMessageStateAction,
  deleteMessageAction,
} from "@/app/admin/actions/messages";
import {
  deleteNavigationItemAction,
  deleteSocialLinkAction,
  saveNavigationItemAction,
  saveSocialLinkAction,
} from "@/app/admin/actions/navigation";
import {
  saveSiteSettingsAction,
  saveThemeSettingsAction,
} from "@/app/admin/actions/settings";
import { deleteMediaAction } from "@/app/admin/actions/media";
import { disableUserAction, saveUserAction } from "@/app/admin/actions/users";
import {
  restorePageAction,
  restorePostAction,
  restoreProjectAction,
} from "@/app/admin/actions/trash";

const inlineActions = {
  clients: { save: saveClientAction, remove: deleteClientAction },
  testimonials: { save: saveTestimonialAction, remove: deleteTestimonialAction },
  process: { save: saveProcessAction, remove: deleteProcessAction },
  stats: { save: saveStatAction, remove: deleteStatAction },
  tags: { save: saveTagAction, remove: deleteTagAction },
} as const;

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const config = getSectionConfig(section);
  const demoMode = isAdminDemoMode();
  if (!config || section === "home") notFound();

  if (config.mode === "detail-collection") {
    const rows = await getCollectionRecords(section);
    return (
      <div className="space-y-6">
        <ReadonlyBanner demoMode={demoMode} />
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">{config.title}</h2>
            <p className="text-sm text-muted">{config.description}</p>
          </div>
          <Button asChild>
            <Link href={`/admin/${section}/new`}>New Item</Link>
          </Button>
        </div>
        <Card className="border-white/10 bg-white/[0.03] p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-muted">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {(rows as unknown as Record<string, unknown>[]).map((row) => (
                  <tr key={String(row.id)} className="border-b border-white/5">
                    <td className="px-4 py-3 text-white">
                      {String(row.title ?? row.name ?? "Untitled")}
                    </td>
                    <td className="px-4 py-3 text-white">{String(row.status ?? "-")}</td>
                    <td className="px-4 py-3 text-muted">
                      {row.updated_at ? formatDate(String(row.updated_at)) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`/admin/${section}/${String(row.id)}`}>Edit</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  if (config.mode === "inline-collection") {
    const rows = await getCollectionRecords(section);
    return (
      <div className="space-y-6">
        <ReadonlyBanner demoMode={demoMode} />
        <InlineCollectionManager
          title={config.title}
          description={config.description}
          fields={config.fields ?? []}
          items={rows as unknown as Record<string, unknown>[]}
          saveAction={inlineActions[section as keyof typeof inlineActions].save}
          deleteAction={inlineActions[section as keyof typeof inlineActions].remove}
          demoMode={demoMode}
        />
      </div>
    );
  }

  if (config.mode === "categories") {
    const data = await getCategoriesData();
    return (
      <div className="space-y-6">
        <ReadonlyBanner demoMode={data.demoMode} />
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Project Categories</h2>
            <ServerForm action={saveProjectCategoryAction} className="mb-6 grid gap-4">
              <input type="hidden" name="id" value="" />
              <Input name="name" placeholder="Apps" className="border-white/10 bg-[#160021]" />
              <Input name="slug" placeholder="apps" className="border-white/10 bg-[#160021]" />
              <Input name="sort_order" type="number" className="border-white/10 bg-[#160021]" />
              <Button type="submit" disabled={data.demoMode}>Save Project Category</Button>
            </ServerForm>
            <div className="space-y-3">
              {data.projectCategories.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 p-4">
                  <div>
                    <p className="text-white">{item.name}</p>
                    <p className="text-sm text-muted">{item.slug}</p>
                  </div>
                  <ActionButton action={() => deleteProjectCategoryAction(item.id)} variant="destructive">Delete</ActionButton>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Post Categories</h2>
            <ServerForm action={savePostCategoryAction} className="mb-6 grid gap-4">
              <input type="hidden" name="id" value="" />
              <Input name="name" placeholder="تەکنەلۆجیا" className="border-white/10 bg-[#160021]" />
              <Input name="slug" placeholder="technology" className="border-white/10 bg-[#160021]" />
              <Button type="submit" disabled={data.demoMode}>Save Post Category</Button>
            </ServerForm>
            <div className="space-y-3">
              {data.postCategories.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 p-4">
                  <div>
                    <p className="text-white">{item.name}</p>
                    <p className="text-sm text-muted">{item.slug}</p>
                  </div>
                  <ActionButton action={() => deletePostCategoryAction(item.id)} variant="destructive">Delete</ActionButton>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (config.mode === "messages") {
    const data = await getMessagesData();
    return (
      <div className="space-y-6">
        <ReadonlyBanner demoMode={data.demoMode} />
        <MessageManager
          items={data.items}
          updateAction={updateMessageStateAction}
          deleteAction={deleteMessageAction}
        />
      </div>
    );
  }

  if (config.mode === "navigation") {
    const data = await getNavigationData();
    return (
      <div className="space-y-6">
        <ReadonlyBanner demoMode={data.demoMode} />
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Menu Items</h2>
            <ServerForm action={saveNavigationItemAction} className="mb-6 grid gap-4">
              <input type="hidden" name="id" value="" />
              <Input name="label" placeholder="سەرەتا" className="border-white/10 bg-[#160021]" />
              <Input name="url" placeholder="/" className="border-white/10 bg-[#160021]" />
              <Input name="sort_order" type="number" className="border-white/10 bg-[#160021]" />
              <Button type="submit" disabled={data.demoMode}>Save Nav Item</Button>
            </ServerForm>
            <div className="space-y-3">
              {data.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 p-4">
                  <div>
                    <p className="text-white">{item.label}</p>
                    <p className="text-sm text-muted">{item.url}</p>
                  </div>
                  <ActionButton action={() => deleteNavigationItemAction(item.id)} variant="destructive">Delete</ActionButton>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Social Links</h2>
            <ServerForm action={saveSocialLinkAction} className="mb-6 grid gap-4">
              <input type="hidden" name="id" value="" />
              <Input name="platform" placeholder="Facebook" className="border-white/10 bg-[#160021]" />
              <Input name="url" placeholder="https://..." className="border-white/10 bg-[#160021]" />
              <Input name="sort_order" type="number" className="border-white/10 bg-[#160021]" />
              <Button type="submit" disabled={data.demoMode}>Save Social Link</Button>
            </ServerForm>
            <div className="space-y-3">
              {data.socialLinks.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 p-4">
                  <div>
                    <p className="text-white">{item.platform}</p>
                    <p className="text-sm text-muted">{item.url}</p>
                  </div>
                  <ActionButton action={() => deleteSocialLinkAction(item.id)} variant="destructive">Delete</ActionButton>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (config.mode === "settings") {
    const data = await getSettingsData();
    return (
      <div className="space-y-6">
        <ReadonlyBanner demoMode={data.demoMode} />
        <Card className="border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Site Settings</h2>
          <ServerForm action={saveSiteSettingsAction as never} className="grid gap-4 md:grid-cols-2">
            <Input name="company_name" defaultValue={data.site.company_name} className="border-white/10 bg-[#160021]" />
            <Input name="company_name_en" defaultValue={data.site.company_name_en} className="border-white/10 bg-[#160021]" />
            <Input name="tagline" defaultValue={data.site.tagline ?? ""} className="border-white/10 bg-[#160021]" />
            <Input name="phone" defaultValue={data.site.phone ?? ""} className="border-white/10 bg-[#160021]" />
            <Input name="email" defaultValue={data.site.email ?? ""} className="border-white/10 bg-[#160021]" />
            <Input name="address" defaultValue={data.site.address ?? ""} className="border-white/10 bg-[#160021]" />
            <Input name="website_url" defaultValue={data.site.website_url ?? ""} className="border-white/10 bg-[#160021]" />
            <Input name="whatsapp" defaultValue={data.site.whatsapp ?? ""} className="border-white/10 bg-[#160021]" />
            <Input name="logo_url" defaultValue={data.site.logo_url ?? ""} className="border-white/10 bg-[#160021]" />
            <Input name="logo_mark_url" defaultValue={data.site.logo_mark_url ?? ""} className="border-white/10 bg-[#160021]" />
            <Input name="favicon_url" defaultValue={data.site.favicon_url ?? ""} className="border-white/10 bg-[#160021]" />
            <Input name="og_image_url" defaultValue={data.site.og_image_url ?? ""} className="border-white/10 bg-[#160021]" />
            <Textarea name="default_seo_title" defaultValue={data.site.default_seo_title ?? ""} className="border-white/10 bg-[#160021]" />
            <Textarea name="default_seo_description" defaultValue={data.site.default_seo_description ?? ""} className="border-white/10 bg-[#160021]" />
            <Textarea name="footer_description" defaultValue={data.site.footer_description ?? ""} className="border-white/10 bg-[#160021]" />
            <Textarea name="copyright_text" defaultValue={data.site.copyright_text ?? ""} className="border-white/10 bg-[#160021]" />
            <Input name="google_maps_url" defaultValue={data.site.google_maps_url ?? ""} className="border-white/10 bg-[#160021] md:col-span-2" />
            <Button type="submit" disabled={data.demoMode} className="md:col-span-2 w-fit">Save Site Settings</Button>
          </ServerForm>
        </Card>

        <Card className="border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Theme Settings</h2>
          <ServerForm action={saveThemeSettingsAction as never} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="mb-2 block">Primary color</Label>
              <Input name="primary_color" defaultValue={data.theme.primary_color} className="border-white/10 bg-[#160021]" />
            </div>
            <div>
              <Label className="mb-2 block">Secondary color</Label>
              <Input name="secondary_color" defaultValue={data.theme.secondary_color} className="border-white/10 bg-[#160021]" />
            </div>
            <div>
              <Label className="mb-2 block">Accent color</Label>
              <Input name="accent_color" defaultValue={data.theme.accent_color} className="border-white/10 bg-[#160021]" />
            </div>
            <div>
              <Label className="mb-2 block">Background color</Label>
              <Input name="background_color" defaultValue={data.theme.background_color} className="border-white/10 bg-[#160021]" />
            </div>
            <Button type="submit" disabled={data.demoMode} className="w-fit">Save Theme</Button>
          </ServerForm>
        </Card>
      </div>
    );
  }

  if (config.mode === "media") {
    const data = await getMediaData();
    return (
      <div className="space-y-6">
        <ReadonlyBanner demoMode={data.demoMode} />
        <Card className="border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Media Library</h2>
          <div className="grid gap-3">
            {data.items.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-white">{item.filename}</p>
                  <p className="text-sm text-muted">{item.url}</p>
                </div>
                <ActionButton action={() => deleteMediaAction(item.id)} variant="destructive">Delete</ActionButton>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (config.mode === "users") {
    const data = await getUsersData();
    return (
      <div className="space-y-6">
        <ReadonlyBanner demoMode={data.demoMode} />
        <Card className="border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Users</h2>
          <ServerForm action={saveUserAction as never} className="mb-6 grid gap-4 md:grid-cols-2">
            <input type="hidden" name="id" value="" />
            <Input name="email" placeholder="admin@rekar.group" className="border-white/10 bg-[#160021]" />
            <Input name="full_name" placeholder="Full name" className="border-white/10 bg-[#160021]" />
            <select name="role" className="flex h-11 rounded-xl border border-white/10 bg-[#160021] px-3 text-sm text-white">
              <option value="editor">editor</option>
              <option value="admin">admin</option>
              <option value="super_admin">super_admin</option>
            </select>
            <Button type="submit" disabled={data.demoMode} className="w-fit">Invite / Update</Button>
          </ServerForm>
          <div className="space-y-3">
            {data.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 p-4">
                <div>
                  <p className="text-white">{item.full_name ?? item.email}</p>
                  <p className="text-sm text-muted">{item.email} - {item.role} - {item.is_active ? "active" : "disabled"}</p>
                </div>
                <ActionButton action={() => disableUserAction(item.id)} variant="destructive">Disable</ActionButton>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (config.mode === "activity") {
    const data = await getActivityData();
    return (
      <div className="space-y-6">
        <ReadonlyBanner demoMode={data.demoMode} />
        <Card className="border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Activity</h2>
          <div className="space-y-3">
            {data.items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 p-4">
                <p className="font-medium text-white">{item.user_name ?? "Unknown"} {item.action} {item.entity}</p>
                <p className="text-sm text-muted">{item.entity_label ?? "-"} - {formatDate(item.created_at)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (config.mode === "trash") {
    const data = await getTrashData();
    const groups = [
      { title: "Projects", items: data.projects, action: restoreProjectAction },
      { title: "Posts", items: data.posts, action: restorePostAction },
      { title: "Pages", items: data.pages, action: restorePageAction },
    ];
    return (
      <div className="space-y-6">
        <ReadonlyBanner demoMode={data.demoMode} />
        {groups.map((group) => (
          <Card key={group.title} className="border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">{group.title}</h2>
            <div className="space-y-3">
              {group.items.length ? group.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 p-4">
                  <div>
                    <p className="text-white">{"title" in item ? item.title : "name" in item ? item.name : "Untitled"}</p>
                    <p className="text-sm text-muted">{item.deleted_at ? formatDate(item.deleted_at) : "-"}</p>
                  </div>
                  <ActionButton action={() => group.action(item.id)} variant="secondary">Restore</ActionButton>
                </div>
              )) : <p className="text-sm text-muted">Trash is empty.</p>}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  notFound();
}

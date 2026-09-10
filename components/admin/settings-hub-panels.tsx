import { ActionButton } from "@/components/admin/action-button";
import { ServerForm } from "@/components/admin/server-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  getActivityData,
  getMediaData,
  getNavigationData,
  getSettingsData,
  getTrashData,
  getUsersData,
} from "@/lib/admin/data";
import { formatDate } from "@/lib/utils";

export async function SettingsSitePanels() {
  const data = await getSettingsData();
  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">ڕێکخستنەکانی سایت</h2>
        <ServerForm action={saveSiteSettingsAction as never} className="grid gap-4 md:grid-cols-2">
          <Input
            name="company_name"
            defaultValue={data.site.company_name}
            className="border-white/10 bg-[#160021]"
          />
          <Input
            name="company_name_en"
            defaultValue={data.site.company_name_en}
            className="border-white/10 bg-[#160021]"
          />
          <Input
            name="tagline"
            defaultValue={data.site.tagline ?? ""}
            className="border-white/10 bg-[#160021]"
          />
          <Input
            name="phone"
            defaultValue={data.site.phone ?? ""}
            className="border-white/10 bg-[#160021]"
          />
          <Input
            name="email"
            defaultValue={data.site.email ?? ""}
            className="border-white/10 bg-[#160021]"
          />
          <Input
            name="address"
            defaultValue={data.site.address ?? ""}
            className="border-white/10 bg-[#160021]"
          />
          <Input
            name="website_url"
            defaultValue={data.site.website_url ?? ""}
            className="border-white/10 bg-[#160021]"
          />
          <Input
            name="whatsapp"
            defaultValue={data.site.whatsapp ?? ""}
            className="border-white/10 bg-[#160021]"
          />
          <Input
            name="logo_url"
            defaultValue={data.site.logo_url ?? ""}
            className="border-white/10 bg-[#160021]"
          />
          <Input
            name="logo_mark_url"
            defaultValue={data.site.logo_mark_url ?? ""}
            className="border-white/10 bg-[#160021]"
          />
          <Input
            name="favicon_url"
            defaultValue={data.site.favicon_url ?? ""}
            className="border-white/10 bg-[#160021]"
          />
          <Input
            name="og_image_url"
            defaultValue={data.site.og_image_url ?? ""}
            className="border-white/10 bg-[#160021]"
          />
          <Textarea
            name="default_seo_title"
            defaultValue={data.site.default_seo_title ?? ""}
            className="border-white/10 bg-[#160021]"
          />
          <Textarea
            name="default_seo_description"
            defaultValue={data.site.default_seo_description ?? ""}
            className="border-white/10 bg-[#160021]"
          />
          <Textarea
            name="footer_description"
            defaultValue={data.site.footer_description ?? ""}
            className="border-white/10 bg-[#160021]"
          />
          <Textarea
            name="copyright_text"
            defaultValue={data.site.copyright_text ?? ""}
            className="border-white/10 bg-[#160021]"
          />
          <Input
            name="google_maps_url"
            defaultValue={data.site.google_maps_url ?? ""}
            className="border-white/10 bg-[#160021] md:col-span-2"
          />
          <Button type="submit" disabled={data.demoMode} className="md:col-span-2 w-fit">
            پاشەکەوتکردنی ڕێکخستنەکانی سایت
          </Button>
        </ServerForm>
      </Card>
      <Card className="border-white/10 bg-white/[0.03] p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">ڕێکخستنی ڕووکار</h2>
        <ServerForm action={saveThemeSettingsAction as never} className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="mb-2 block">ڕەنگی سەرەکی</Label>
            <Input
              name="primary_color"
              defaultValue={data.theme.primary_color}
              className="border-white/10 bg-[#160021]"
            />
          </div>
          <div>
            <Label className="mb-2 block">ڕەنگی لاوەکی</Label>
            <Input
              name="secondary_color"
              defaultValue={data.theme.secondary_color}
              className="border-white/10 bg-[#160021]"
            />
          </div>
          <div>
            <Label className="mb-2 block">ڕەنگی جەخت</Label>
            <Input
              name="accent_color"
              defaultValue={data.theme.accent_color}
              className="border-white/10 bg-[#160021]"
            />
          </div>
          <div>
            <Label className="mb-2 block">ڕەنگی پاشبنەما</Label>
            <Input
              name="background_color"
              defaultValue={data.theme.background_color}
              className="border-white/10 bg-[#160021]"
            />
          </div>
          <Button type="submit" disabled={data.demoMode} className="w-fit">
            پاشەکەوتکردنی ڕووکار
          </Button>
        </ServerForm>
      </Card>
    </div>
  );
}

export async function SettingsNavigationPanel() {
  const data = await getNavigationData();
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="border-white/10 bg-white/[0.03] p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">بڕگەکانی مێنیو</h2>
        <ServerForm action={saveNavigationItemAction} className="mb-6 grid gap-4">
          <input type="hidden" name="id" value="" />
          <Input name="label" placeholder="ناونیشان" className="border-white/10 bg-[#160021]" />
          <Input name="url" placeholder="/projects" dir="ltr" className="border-white/10 bg-[#160021]" />
          <Input name="sort_order" type="number" defaultValue={0} className="border-white/10 bg-[#160021]" />
          <Button type="submit" disabled={data.demoMode}>
            پاشەکەوتکردن
          </Button>
        </ServerForm>
        <div className="space-y-3">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 p-4"
            >
              <div>
                <p className="text-white">{item.label}</p>
                <p className="text-sm text-muted" dir="ltr">
                  {item.url}
                </p>
              </div>
              <ActionButton action={() => deleteNavigationItemAction(item.id)} variant="destructive">
                سڕینەوە
              </ActionButton>
            </div>
          ))}
        </div>
      </Card>
      <Card className="border-white/10 bg-white/[0.03] p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">بەستەرە کۆمەڵایەتییەکان</h2>
        <ServerForm action={saveSocialLinkAction} className="mb-6 grid gap-4">
          <input type="hidden" name="id" value="" />
          <Input name="platform" placeholder="Facebook" className="border-white/10 bg-[#160021]" />
          <Input name="url" placeholder="https://..." dir="ltr" className="border-white/10 bg-[#160021]" />
          <Input name="sort_order" type="number" defaultValue={0} className="border-white/10 bg-[#160021]" />
          <Button type="submit" disabled={data.demoMode}>
            پاشەکەوتکردن
          </Button>
        </ServerForm>
        <div className="space-y-3">
          {data.socialLinks.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 p-4"
            >
              <div>
                <p className="text-white">{item.platform}</p>
                <p className="text-sm text-muted" dir="ltr">
                  {item.url}
                </p>
              </div>
              <ActionButton action={() => deleteSocialLinkAction(item.id)} variant="destructive">
                سڕینەوە
              </ActionButton>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export async function SettingsMediaPanel() {
  const data = await getMediaData();
  return (
    <Card className="border-white/10 bg-white/[0.03] p-6">
      <h2 className="mb-4 text-xl font-semibold text-white">کتێبخانەی میدیا</h2>
      <div className="grid gap-3">
        {data.items.length ? (
          data.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-white">{item.filename}</p>
                <p className="text-sm text-muted" dir="ltr">
                  {item.url}
                </p>
              </div>
              <ActionButton action={() => deleteMediaAction(item.id)} variant="destructive">
                سڕینەوە
              </ActionButton>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted">هیچ میدیایەک نییە.</p>
        )}
      </div>
    </Card>
  );
}

export async function SettingsUsersPanel() {
  const data = await getUsersData();
  return (
    <Card className="border-white/10 bg-white/[0.03] p-6">
      <h2 className="mb-4 text-xl font-semibold text-white">بەکارهێنەران</h2>
      <ServerForm action={saveUserAction as never} className="mb-6 grid gap-4 md:grid-cols-2">
        <input type="hidden" name="id" value="" />
        <Input name="email" placeholder="admin@rekar.group" className="border-white/10 bg-[#160021]" />
        <Input name="full_name" placeholder="ناوی تەواو" className="border-white/10 bg-[#160021]" />
        <select
          name="role"
          className="flex h-11 rounded-xl border border-white/10 bg-[#160021] px-3 text-sm text-white"
        >
          <option value="editor">دەستکاریکەر</option>
          <option value="admin">ئەدمین</option>
          <option value="super_admin">سوپەر ئەدمین</option>
        </select>
        <Button type="submit" disabled={data.demoMode} className="w-fit">
          بانگهێشت / نوێکردنەوە
        </Button>
      </ServerForm>
      <div className="space-y-3">
        {data.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 p-4"
          >
            <div>
              <p className="text-white">{item.full_name ?? item.email}</p>
              <p className="text-sm text-muted">
                {item.email} - {item.role} - {item.is_active ? "چالاک" : "ناچالاک"}
              </p>
            </div>
            <ActionButton action={() => disableUserAction(item.id)} variant="destructive">
              ناچالاککردن
            </ActionButton>
          </div>
        ))}
      </div>
    </Card>
  );
}

export async function SettingsActivityPanel() {
  const data = await getActivityData();
  return (
    <Card className="border-white/10 bg-white/[0.03] p-6">
      <h2 className="mb-4 text-xl font-semibold text-white">چالاکی</h2>
      <div className="space-y-3">
        {data.items.length ? (
          data.items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 p-4">
              <p className="font-medium text-white">
                {item.user_name ?? "نەناسراو"} {item.action} {item.entity}
              </p>
              <p className="text-sm text-muted">
                {item.entity_label ?? "-"} - {formatDate(item.created_at)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted">هیچ چالاکییەک نییە.</p>
        )}
      </div>
    </Card>
  );
}

export async function SettingsTrashPanel() {
  const data = await getTrashData();
  const groups = [
    { title: "پڕۆژەکان", items: data.projects, action: restoreProjectAction },
    { title: "پۆستەکان", items: data.posts, action: restorePostAction },
    { title: "پەڕەکان", items: data.pages, action: restorePageAction },
  ];
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <Card key={group.title} className="border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">{group.title}</h2>
          <div className="space-y-3">
            {group.items.length ? (
              group.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 p-4"
                >
                  <div>
                    <p className="text-white">
                      {"title" in item ? item.title : "name" in item ? item.name : "بێ ناونیشان"}
                    </p>
                    <p className="text-sm text-muted">
                      {item.deleted_at ? formatDate(item.deleted_at) : "-"}
                    </p>
                  </div>
                  <ActionButton action={() => group.action(item.id)} variant="secondary">
                    گەڕاندنەوە
                  </ActionButton>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">زبڵ بەتاڵە.</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

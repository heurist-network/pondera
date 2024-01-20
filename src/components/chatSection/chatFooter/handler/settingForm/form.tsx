import React from "react";
import Locale from "@/locales";
import { MODLES } from "@/lib/models";
import {
  useChannelStore,
  type ChannelListItem,
  type ChannelSize,
  type ChannelQuality,
  type ChannelStyle,
} from "@/hooks/useChannel";
import { useModelCacheStore } from "@/hooks/useModelCache";
import { isUndefined } from "@/lib/is";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormProps {
  onClose: () => void;
}

export interface FormRef {
  submit: () => void;
}

interface IConversationSettings {
  name: string;
  model_type: string;
  model_value: string;
  context_length: string;
  summarize_threshold: string;
  size: ChannelSize;
  quality: ChannelQuality;
  style: ChannelStyle;
  prompt: string;
  plugins: string[];
}

const lengthOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e) => ({
  label: String(e),
  value: String(e),
}));

const Form = React.forwardRef<FormRef, FormProps>(
  ({ onClose }, forwardedRef) => {
    // hooks store
    const [activeId, list] = useChannelStore((state) => [
      state.activeId,
      state.list,
    ]);

    // state
    const [formType, setFormType] = React.useState<"gpt" | "dall">("gpt");
    const [formData, setFormData] = React.useState<IConversationSettings>({
      name: "",
      model_type: "",
      model_value: "",
      context_length: "8",
      summarize_threshold: "1000",
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
      prompt: "",
      plugins: [],
    });

    // hooks fn
    const updateList = useChannelStore((state) => state.updateList);
    const updateType = useModelCacheStore((state) => state.updateType);
    const updateName = useModelCacheStore((state) => state.updateName);

    const onChangeForm = (value: any, key: keyof IConversationSettings) => {
      if (key === "model_value") {
        setFormType(value.startsWith("dall") ? "dall" : "gpt");
      }

      setFormData((data: IConversationSettings) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData[key] = value;
        return newData;
      });
    };

    const onBlur = (value: string) => {
      const min = 1;
      setFormData((data: IConversationSettings) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData.summarize_threshold = Number(value) < min ? String(min) : value;
        return newData;
      });
    };

    React.useEffect(() => {
      const findCh = list.find((item) => item.channel_id === activeId);
      if (!findCh) return;
      const {
        channel_name,
        channel_model,
        channel_context_length,
        channel_prompt,
        channel_plugins,
        channel_summarize_threshold,
        channel_size,
        channel_quality,
        channel_style,
      } = findCh;

      let context_length = "8";
      let summarize_threshold = "1000";
      if (!isUndefined(channel_context_length)) {
        context_length = String(channel_context_length);
      }
      if (!isUndefined(channel_summarize_threshold)) {
        summarize_threshold = String(channel_summarize_threshold);
      }

      setFormType(
        findCh.channel_model.name.startsWith("dall") ? "dall" : "gpt"
      );

      setFormData({
        name: channel_name,
        model_type: channel_model.type,
        model_value: channel_model.name,
        // default is 8
        context_length,
        // default is 1000
        summarize_threshold,
        size: channel_size,
        quality: channel_quality,
        style: channel_style,
        prompt: channel_prompt,
        plugins: channel_plugins,
      });
    }, []);

    React.useImperativeHandle(forwardedRef, () => ({
      submit() {
        const newList: ChannelListItem[] = JSON.parse(JSON.stringify(list));
        const findCh = newList.find((item) => item.channel_id === activeId);
        if (!findCh) return;

        findCh.channel_name = formData.name;
        findCh.channel_model.type = formData.model_type;
        findCh.channel_model.name = formData.model_value;
        findCh.channel_context_length = Number(formData.context_length);
        findCh.channel_summarize_threshold = Number(
          formData.summarize_threshold
        );
        findCh.channel_prompt = formData.prompt;
        findCh.channel_plugins = formData.plugins;
        findCh.channel_size = formData.size;
        findCh.channel_quality = formData.quality;
        findCh.channel_style = formData.style;

        updateList(newList);
        updateType(formData.model_type);
        updateName(formData.model_value);

        onClose();
      },
    }));

    return (
      <div className="grid gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="model">{Locale.global.model}</Label>
          <Select
            value={formData.model_value}
            onValueChange={(value) => onChangeForm(value, "model_value")}
          >
            <SelectTrigger id="model" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              {MODLES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full flex justify-center items-center",
                        {
                          "bg-[#5bc083]": item.value.startsWith("gpt-3"),
                          "bg-[#a26bf7]": item.value.startsWith("gpt-4"),
                          "bg-[#df6b29]": item.value.startsWith("dall"),
                        }
                      )}
                    >
                      <span className="i-ri-openai-fill text-white w-4 h-4" />
                    </div>
                    <span>{item.value}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {formType === "gpt" ? (
          <div className="grid gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">{Locale.global.title}</Label>
              <Input
                id="title"
                className="h-9"
                maxLength={30}
                value={formData.name}
                onChange={(e) => onChangeForm(e.target.value, "name")}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label
                htmlFor="context-limit"
                className="flex items-center gap-2"
              >
                {Locale.chat["context-limit"]}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center">
                      <span className="i-mingcute-question-line h-[18px] w-[18px]" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[calc(100vw-4rem)]">
                      {Locale.chat["context-limit-tip"]}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select
                value={formData.context_length}
                onValueChange={(value) => onChangeForm(value, "context_length")}
              >
                <SelectTrigger id="context-limit" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  {lengthOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label
                htmlFor="summarize_threshold"
                className="flex items-center gap-2"
              >
                {Locale.chat.threshold}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center">
                      <span className="i-mingcute-question-line h-[18px] w-[18px]" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[calc(100vw-4rem)]">
                      {Locale.chat["threshold-tip"]}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="summarize_threshold"
                className="h-9"
                type="number"
                value={formData.summarize_threshold}
                onChange={(e) =>
                  onChangeForm(e.target.value, "summarize_threshold")
                }
                onBlur={(e) => onBlur(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="system-prompt">
                {Locale.global["system-prompt"]}
              </Label>
              <Textarea
                id="system-prompt"
                value={formData.prompt}
                onChange={(e) => onChangeForm(e.target.value, "prompt")}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="size">{Locale.global.size}</Label>
              <Select
                value={formData.size}
                onValueChange={(value) => onChangeForm(value, "size")}
              >
                <SelectTrigger id="size" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024x1024">1024x1024</SelectItem>
                  <SelectItem value="1792x1024">1792x1024</SelectItem>
                  <SelectItem value="1024x1792">1024x1792</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="quality">{Locale.global.quality}</Label>
              <Select
                value={formData.quality}
                onValueChange={(value) => onChangeForm(value, "quality")}
              >
                <SelectTrigger id="quality" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">
                    {Locale.global.standard}
                  </SelectItem>
                  <SelectItem value="hd"> {Locale.global.hd}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="style">{Locale.global.style}</Label>
              <Select
                value={formData.style}
                onValueChange={(value) => onChangeForm(value, "style")}
              >
                <SelectTrigger id="style" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vivid">{Locale.global.vivid}</SelectItem>
                  <SelectItem value="natural">
                    {Locale.global.natural}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    );
  }
);

Form.displayName = "SettingForm";

export default Form;

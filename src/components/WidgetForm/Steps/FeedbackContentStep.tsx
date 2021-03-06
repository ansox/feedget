import { ArrowLeft } from "phosphor-react";
import React, { FormEvent } from "react";
import { FeedbackType, feedbackTypes } from "..";
import { api } from "../../../lib/apis";
import { CloseButton } from "../../CloseButton";
import { Loading } from "../Loading";
import { ScreenShotButton } from "../ScreenShotButton";

interface FeedbackContentStepProps {
  feedbackType: FeedbackType;
  onFeedbackRestartRequest: () => void;
  onFeedbackSent: () => void;
}

export function FeedbackContentStep({feedbackType, onFeedbackRestartRequest, onFeedbackSent}: FeedbackContentStepProps) {
  const feedbackTypeInfo = feedbackTypes[feedbackType];
  const [screenshot, setScreenshot] = React.useState<string | null>(null);
  const [comment, setComment] = React.useState<string>('');
  const [isSendingFeedback, setIsSendingFeedback] = React.useState(false);

  async function handleSubmitFeedback(event: FormEvent) {
    event.preventDefault();

    setIsSendingFeedback(true);
   
    await fetch(`${api.baseURL}/feedbacks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: feedbackType,
        comment,
        screenshot
      })
    })

    setIsSendingFeedback(false);
    onFeedbackSent();
  }

  return (
    <>
     <header>
        <button type="button" onClick={onFeedbackRestartRequest} className="top-5 left-5 absolute text-zinc-400 hover:text-zinc-100">
          <ArrowLeft weight="bold" className="w-4 h-4"/>
        </button>
        <span className="text-xl leading-6 flex items-center gap-2">
          <img src={feedbackTypeInfo.image.source} alt={feedbackTypeInfo.image.alt} className="w-6 h-6"></img>
          {feedbackTypeInfo.title}
        </span>
        <CloseButton />
      </header>
     
      <form onSubmit={handleSubmitFeedback} className="my-4 w-full">
        <textarea 
        onChange={(e) => setComment(e.target.value)}
        className="min-w-[304px] w-full min-h-[112px] text-sm placeholder-zinc-400 text-zinc-100 border-zinc-600 bg-transparent rounded-md focus:border-brand-500 focus:ring-brand-500 focus:ring-1 focus:outline-none resize-none" placeholder="Conte com detalhes o que est?? acontecendo..."/>

        <footer className="flex gap-2 mt-2">
          <ScreenShotButton screenShot={screenshot} onScreenshotTook={setScreenshot} />
          <button
            type="submit"
            className="p-2 bg-brand-500 rounded-md border-transparent flex-1 flex items-center justify-center text-sm hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-brand-500 transitions-colors disabled:opacity-50 disabled:hover:bg-brand-500"
            disabled={!comment || isSendingFeedback}
          >
            { isSendingFeedback ? <Loading /> : 'Enviar feedback' }
          </button>
        </footer>
      </form>
    </>
  );
}
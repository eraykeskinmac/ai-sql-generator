'use client';
import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import Dialog from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import { Code, Loader2 } from 'lucide-react';

import { generateSql } from './actions';
import DynamicTable from './dynamic-table';

export default function Home() {
  const [prompt, setPrompt] = useState<string>('');
  const [schemaFile, setSchemaFile] = useState<File | null>(null);
  const [connectionUrl, setConnectionUrl] = useState<string>('');
  const [result, setResult] = useState<{
    data: any;
    query: string;
  }>();
  const [showSql, setShowSql] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const generateSqlFromServer = async () => {
    setLoader(true);
    if (!schemaFile || !prompt || !connectionUrl) {
      setLoader(false);
      alert('Please select a schema file and write a prompt');
      return;
    }

    let reader = new FileReader();
    reader.readAsText(schemaFile);

    reader.onload = async function () {
      const schema = reader.result as string;
      const result = await generateSql(prompt, schema, connectionUrl);
      setResult(result);
      setLoader(false);
    };
  };

  return (
    <div className="h-screen text-white flex flex-col container mx-auto">
      <div className="text-3xl p-3  flex justify-between">
        <div>SQL Generator</div>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button.Root>
              <Button.Icon type="only">
                <Bookmark color="white" />
              </Button.Icon>
            </Button.Root>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content className="max-w-2xl">
              <Dialog.Title className="text-white">
                Write Your connection url
              </Dialog.Title>
              <Dialog.Description className="mt-2">
                <input
                  value={connectionUrl}
                  onChange={(e) => setConnectionUrl(e.target.value)}
                  type="text"
                  className="flex-grow text-lg p-2  px-2 py-1  w-full bg-[#1A1A1A] text-white border rounded-xl border-gray-600 focus:outline-none  placeholder-gray-400"
                  placeholder="Connection URL"
                />
              </Dialog.Description>

              <Dialog.Actions className="mt-4">
                <Dialog.Close asChild>
                  <Button.Root variant="outlined" size="sm" intent="neutral">
                    <Button.Label>Cancel</Button.Label>
                  </Button.Root>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <Button.Root variant="outlined" size="sm" intent="neutral">
                    <Button.Label>Save</Button.Label>
                  </Button.Root>
                </Dialog.Close>
              </Dialog.Actions>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <div className="flex-grow flex flex-col justify-end p-3 gap-3">
        <div className="flex-grow">
          {loader && (
            <div className="flex justify-center items-center text-center">
              <Loader2 className="animate-spin" size={45} />
            </div>
          )}
          {result && (
            <button className="gap-2" onClick={() => setShowSql(!showSql)}>
              Show SQL <Code />{' '}
            </button>
          )}
          {result && showSql && (
            <div className="p-2 my-3">
              <pre className="p-3 bg-white text-black">
                {result && result.query}
              </pre>
            </div>
          )}
          {result ? (
            <DynamicTable data={result.data} />
          ) : (
            <div>Generate Something</div>
          )}
        </div>
        <div className="flex">
          <input
            placeholder="Select your schema"
            type="file"
            onChange={(e) => {
              setSchemaFile(e.target.files?.[0] || null);
            }}
          />
        </div>
        <div className="flex gap-3">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-grow text-lg p-2 bg-[#1A1A1A] text-white border rounded-xl border-gray-600 focus:outline-none placeholder-gray-400"
            placeholder="Write your prompt"
            type="text"
          />
          <button
            onClick={() => {
              generateSqlFromServer();
            }}
            className="bg-black text-white px-2 py-1 rounded-md"
          >
            Generate SQL
          </button>
        </div>
      </div>
    </div>
  );
}

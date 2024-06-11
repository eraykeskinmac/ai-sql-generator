'use client';

import { useState } from 'react';

import { Code, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

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
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="text-3xl p-3  bg-white">SQL Generator</div>
      <div className="flex-grow flex flex-col justify-end p-3 gap-3">
        <div className="flex-grow">
          {loader && (
            <div className="flex justify-center items-center text-center">
              <Loader2 className="animate-spin" size={45} />
            </div>
          )}
          {result && (
            <Button className="gap-2" onClick={() => setShowSql(!showSql)}>
              Show SQL <Code />{' '}
            </Button>
          )}
          {result && showSql && (
            <div className="p-2 my-3">
              <pre className="p-3 bg-black text-white">
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
            placeholder="Select your  schema"
            type="file"
            onChange={(e) => {
              setSchemaFile(e.target.files?.[0] || null);
            }}
          />
          {/* <input
            value={connectionUrl}
            onChange={(e) => setConnectionUrl(e.target.value)}
            type="text"
            className="flex-grow text-lg p-2 bg-slate-800 text-white px-2 py-1 rounded-md"
            placeholder="Connection URL"
          /> */}
        </div>
        <div className="flex gap-3">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write your prompt"
            className="flex-grow text-xl p-2 border-slate-800 rounded-md border-2"
            type="text"
          />
          <button
            onClick={() => {
              generateSqlFromServer();
            }}
            className="bg-slate-800 text-white px-2 py-1 rounded-md"
          >
            Generate SQL
          </button>
        </div>
      </div>
    </div>
  );
}

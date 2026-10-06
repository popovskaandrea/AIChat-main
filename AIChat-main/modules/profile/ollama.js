import { ChromaVectorStore } from "@llamaindex/chroma";
import ChromaClient from "chroma-js";
import { 
    Settings,
    VectorStoreIndex, 
    storageContextFromDefaults, 
    SentenceSplitter
} from "llamaindex";
import { Ollama, OllamaEmbedding } from "@llamaindex/ollama";
import { SimpleDirectoryReader } from "@llamaindex/readers/directory";

Settings.embedModel = new OllamaEmbedding({ model: "mxbai-embed-large:latest" });
Settings.llm = new Ollama({
  model: "llama3.2:3b",
  baseUrl: "http://127.0.0.1:11434"
});

export async function createLibrarianIndex(userId, librarianId, uploadDirPath) {
    const collectionName = `user_${userId}_lib_${librarianId}`

    const chromeStore = new ChromaVectorStore({
        collectionName: collectionName,
        url: "http://localhost:8000"
    })

    const storageContext = await storageContextFromDefaults({
        vectorStore: chromeStore
    });

    const reader = new SimpleDirectoryReader();
    const documents = await reader.loadData({ directoryPath: uploadDirPath });

    const splitter = new SentenceSplitter({ chunkSize: 300, chunkOverlap: 20 });
    const nodes = splitter.getNodesFromDocuments(documents);

    const index = await VectorStoreIndex.init({
        nodes: nodes,
        storageContext: storageContext
    });

    console.log(`Successfully created isolated collection: ${collectionName}`);
    return index;
}

export async function chatWithLibrarian(userId, librarianId, userQuery) {
    const collectionName = `user_${userId}_lib_${librarianId}`

    const chromeStore = new ChromaVectorStore({
        collectionName: collectionName,
        url: "http://localhost:8000"
    })

    const storageContext = await storageContextFromDefaults({
        vectorStore: chromeStore
    })

    const index = await VectorStoreIndex.fromVectorStore(chromeStore, storageContext)

    const ollamaLLM = new Ollama({ model: "llama3.2:3b" })

    const queryEngine = index.asChatEngine({
        llm: ollamaLLM
    }) 

    const query = `Answer only from chromaDB and short answers only: ${userQuery}`

    const response = await queryEngine.chat({ message: query });

    return response.message.content
} 

export async function deleteLibrarian(userId, librarianId) {
    const client = new ChromaClient({ path: "http://localhost:8000" })
        
    const collectionName = `user_${userId}_lib_${librarianId}`

    await client.deleteCollection({ name: collectionName })

    console.log(`Wiped collection ${collectionName} from disk.`)
}

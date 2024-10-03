import {useAtom} from "jotai";
import {newPaperAtom, paperAtom} from "../atoms/Atoms.ts";
import {createPaper, fetchPapers} from "../services/PaperService.ts";


const CreatePaperForm: React.FC = () => {
    const[newPaper, setNewPaper] = useAtom(newPaperAtom);
    const[ , setPapers] = useAtom(paperAtom);

    const handleCreatePaper = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await createPaper({
                name: newPaper.name || "",
                discontinued: newPaper.discontinued,
                stock: newPaper.stock,
                price: newPaper.price
            });
            setNewPaper({ ...newPaper, name: "", stock: 0, price: 0, discontinued: false });
            const fetchedPapers = await fetchPapers();
            setPapers(fetchedPapers);
        } catch (error) {
            console.error('Error creating paper:', error);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semi">Add New Paper:</h2>

            <form onSubmit={handleCreatePaper}>
                <div className="flex-col items-center space-x-1">
                    <label className="block text-sm text-gray-500">Paper Name:</label>
                    <input
                        type="text"
                        value={newPaper.name || ""}
                        onChange={(e) => setNewPaper({...newPaper, name: e.target.value})}
                        required
                        className="mt-1 mb-2 block w-30 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-900 text-gray-500"
                    />

                    <label className="block text-sm text-gray-500">Stock:</label>
                    <input
                        type="number"
                        value={newPaper.stock}
                        onChange={(e) => setNewPaper({...newPaper, stock: parseInt(e.target.value)})}
                        required
                        className="mt-1 mb-2 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-900 text-gray-500"
                    />
                    <label className="block text-sm text-gray-500">Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        value={newPaper.price}
                        onChange={(e) => setNewPaper({...newPaper, price: parseFloat(e.target.value)})}
                        required
                        className="mt-1 mb-2 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-900 text-gray-500"
                    />
                    <label className="block text-sm text-gray-500">Discontinued:</label>
                    <input
                        type="checkbox"
                        checked={newPaper.discontinued}
                        onChange={(e) => setNewPaper({...newPaper, discontinued: e.target.checked})}
                        className="mt-1 mb-2 block"
                    />
                </div>
                <button type="submit">Add Paper</button>
            </form>
        </div>
    );
};

export default CreatePaperForm;


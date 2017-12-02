import { RecipeRepo } from '~/repository/RecipeRepo';
import { Treatment } from '~/models/recipe/Treatment';

export class ScoopService {
    static getAllTreatments = async (): Promise<Treatment[]> => {
        const recipes = await RecipeRepo.loadLatestLocalRecipes();
        let treatments: Treatment[] = [];
        recipes.forEach((recipe) => {
            recipe.treatments.forEach((t) => {
                // The "var" property must be unique... we might eventually need to define a formal tie-breaker
                if (!treatments.find((existingTreatment) => existingTreatment.var === t.var)) {
                    treatments.push(t);
                }
            });
        });
        return treatments;
    };
}

# Documenter Leetcode Challenges

An easy way to document your Leetcode challenges, organize them by language, and keep everything structured!

## Features:
- Automatically fetches challenge descriptions and metadata directly from the Leetcode website.
- Creates individual folders for each challenge.
- Generates a `README.md` for each challenge with details such as title, description, and the solution.
- Organizes challenges by programming language.
- Creates a main `README.md` listing all solved challenges categorized by language.
- Supports documenting challenges from Leetcode study plans or custom lists.

## Setup:
1. Clone the repository.
2. Run the following command to install dependencies:

   ```bash
   npm i
   ```
3. Create a ```.env``` file based on ```.env.example```. Here's an example of the .env content:

```
# Target destination
PROJECT_DIR_PATH=/home/username/directory

# Remote repository (Ex: GitHub)
REPOSITORY_URL=https://github.com/{username}/{repositoriy_name}/tree/{branch_name}

# Challenges list from Leetcode
CHALLENGES_LIST_URL=https://leetcode.com/problem-list/mjk2zv73/

# Change the default value if you want to document your list challenge in its own remote repository
USE_LIST_NAME_IN_README_URL=true
```
<br>
4. Edit the .env file with the appropriate values.

## Running the Script:
1. Once everything is set up, run the script with the following command:

   ```bash
   node .
   ```

2. The script will:

- Fetch the challenge list from the `CHALLENGES_LIST_URL`.
- Create folders for each challenge.
- Generate a detailed `README.md` file for each challenge.
- Update the main `README.md` with an organized list of challenges.

## Folder Structure:
The script will create a folder structure in the target directory like the following:

- Study Plan

```
project-dir/
|-- list-dir/
|   |-- code-language/
|       |-- category/
|           |-- challenge1/
|               |-- README.md
|               |-- solution.ext
|           |-- challenge2/
|               |-- README.md
|               |-- solution.ext
|           ...
|   |-- main-README.md
```
- Custom List

```
project-dir/
|-- list-dir/
|   |-- code-language/
|       |-- challenge1/
|           |-- README.md
|           |-- solution.ext
|       |-- challenge2/
|           |-- README.md
|           |-- solution.ext
|       ...
|   |-- main-README.md
```
Each challenge folder will contain:

- The challenge's `README.md` with its title, description, and solution.
- The solution file.

The main `README.md` will include:

- A list of all documented challenges.
- Categorization by programming language. (If aplicable)
- Differentiation between study plan and custom lists.
